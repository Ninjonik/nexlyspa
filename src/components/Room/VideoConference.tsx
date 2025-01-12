"use client";

import {
  CarouselLayout,
  ConnectionStateToast,
  DisconnectButton,
  FocusLayout,
  FocusLayoutContainer,
  GridLayout,
  isTrackReference,
  LayoutContextProvider,
  ParticipantTile,
  RoomAudioRenderer,
  StartAudio,
  TrackReferenceOrPlaceholder,
  TrackToggle,
  useCreateLayoutContext,
  usePinnedTracks,
  useTracks,
  VideoConferenceProps,
  WidgetState,
} from "@livekit/components-react";
import React, { useEffect } from "react";
import { RoomEvent, Track } from "livekit-client";
import { isEqualTrackRef, isWeb } from "@livekit/components-core";
import { ImPhoneHangUp } from "react-icons/im";
import { useLocalSettingsContext } from "../../utils/LocalSettingsContext.tsx";
import Source = Track.Source;

interface ExtendedVideoConferenceProps extends VideoConferenceProps {
  handleOnDisconnectedFn: () => void;
}

export default function VideoConference({
  SettingsComponent,
  handleOnDisconnectedFn,
  ...props
}: ExtendedVideoConferenceProps) {
  const [widgetState, setWidgetState] = React.useState<WidgetState>({
    showChat: false,
    unreadMessages: 0,
    showSettings: false,
  });
  const lastAutoFocusedScreenShareTrack =
    React.useRef<TrackReferenceOrPlaceholder | null>(null);

  const { setLocalOptions } = useLocalSettingsContext();

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false },
  );

  const widgetUpdate = (state: WidgetState) => {
    setWidgetState(state);
  };

  const layoutContext = useCreateLayoutContext();

  const screenShareTracks = tracks
    .filter(isTrackReference)
    .filter((track) => track.publication.source === Track.Source.ScreenShare);

  const focusTrack = usePinnedTracks(layoutContext)?.[0];
  const carouselTracks = tracks.filter(
    (track) => !isEqualTrackRef(track, focusTrack),
  );

  React.useEffect(() => {
    // If screen share tracks are published, and no pin is set explicitly, auto set the screen share.
    if (
      screenShareTracks.some((track) => track.publication.isSubscribed) &&
      lastAutoFocusedScreenShareTrack.current === null
    ) {
      layoutContext.pin.dispatch?.({
        msg: "set_pin",
        trackReference: screenShareTracks[0],
      });
      lastAutoFocusedScreenShareTrack.current = screenShareTracks[0];
    } else if (
      lastAutoFocusedScreenShareTrack.current &&
      !screenShareTracks.some(
        (track) =>
          track.publication.trackSid ===
          lastAutoFocusedScreenShareTrack.current?.publication?.trackSid,
      )
    ) {
      layoutContext.pin.dispatch?.({ msg: "clear_pin" });
      lastAutoFocusedScreenShareTrack.current = null;
    }
  }, [
    screenShareTracks
      .map(
        (ref) => `${ref.publication.trackSid}_${ref.publication.isSubscribed}`,
      )
      .join(),
    focusTrack?.publication?.trackSid,
  ]);

  const { options } = useLocalSettingsContext();
  useEffect(() => {
    if (options.deaf) {
      tracks.forEach((publication) => (publication.participant.audioLevel = 0));
    } else {
      tracks.forEach((publication) => (publication.participant.audioLevel = 1));
    }
  }, [options]);
  // TODO: Make it so the deafen/undeafen functionality actually does work

  return (
    <div className="lk-video-conference" {...props}>
      {isWeb() && (
        <LayoutContextProvider
          value={layoutContext}
          // onPinChange={handleFocusStateChange}
          onWidgetChange={widgetUpdate}
        >
          <div className="lk-video-conference-inner">
            {!focusTrack ? (
              <div className="lk-grid-layout-wrapper">
                <GridLayout tracks={tracks}>
                  <ParticipantTile />
                </GridLayout>
              </div>
            ) : (
              <div className="lk-focus-layout-wrapper">
                <FocusLayoutContainer>
                  <CarouselLayout tracks={carouselTracks}>
                    <ParticipantTile />
                  </CarouselLayout>
                  {focusTrack && <FocusLayout trackRef={focusTrack} />}
                </FocusLayoutContainer>
              </div>
            )}
            <div
              className={"flex flex-row justify-center items-center gap-4 p-2"}
            >
              <TrackToggle source={Source.Camera} />
              <TrackToggle
                source={Source.Microphone}
                onClick={() => setLocalOptions("muted")}
              />
              <TrackToggle source={Source.ScreenShare} />
              <DisconnectButton onClick={handleOnDisconnectedFn}>
                <ImPhoneHangUp />
              </DisconnectButton>
              <StartAudio label={"Audio"} />
            </div>
          </div>
          {SettingsComponent && (
            <div
              className="lk-settings-menu-modal"
              style={{ display: widgetState.showSettings ? "block" : "none" }}
            >
              <SettingsComponent />
            </div>
          )}
        </LayoutContextProvider>
      )}
      <RoomAudioRenderer />
      <ConnectionStateToast />
    </div>
  );
}
