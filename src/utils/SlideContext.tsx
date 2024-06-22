import React, { createContext, ReactNode, useContext, useState } from "react";

interface SlideContextProps {
  children: ReactNode;
}

interface SlideContextValue {
  slide: "sidebar" | "main";
  setSlide: React.Dispatch<React.SetStateAction<"sidebar" | "main">>;
  touchStart: number | null;
  setTouchStart: React.Dispatch<React.SetStateAction<number | null>>;
  touchEnd: number | null;
  setTouchEnd: React.Dispatch<React.SetStateAction<number | null>>;
  onTouchStart: React.TouchEventHandler<HTMLElement>;
  onTouchMove: React.TouchEventHandler<HTMLElement>;
  onTouchEnd: React.TouchEventHandler<HTMLElement>;
}

const SlideContext = createContext<SlideContextValue | undefined>(undefined);

export const useSlideContext = () => {
  const context = useContext(SlideContext);
  if (!context) {
    throw new Error(
      "useSlideContext must be used within a SlideContextProvider",
    );
  }
  return context;
};

export const SlideContextProvider = ({ children }: SlideContextProps) => {
  const [slide, setSlide] = useState<"sidebar" | "main">("sidebar");
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart: React.TouchEventHandler<HTMLElement> = (e) => {
    setTouchEnd(null);
    setTouchStart(e.touches[0].clientX);
  };

  const onTouchMove: React.TouchEventHandler<HTMLElement> = (e) =>
    setTouchEnd(e.touches[0].clientX);

  const onTouchEnd: React.TouchEventHandler<HTMLElement> = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) setSlide("main");
    if (isRightSwipe) setSlide("sidebar");
  };

  console.log("SLIDE:", slide);

  return (
    <SlideContext.Provider
      value={{
        slide,
        setSlide,
        touchStart,
        setTouchStart,
        touchEnd,
        setTouchEnd,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
      }}
    >
      {children}
    </SlideContext.Provider>
  );
};
