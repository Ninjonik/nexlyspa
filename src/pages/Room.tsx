import { useNavigate, useParams } from "react-router-dom";

export const Room = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  if (!roomId) return navigate("/");

  return (
    <section
      className={"md:visible w-4/5 h-full bg-base-200 p-8 flex flex-col gap-8"}
    >
      <h2 className={"text-center text-5xl"}>Nexly</h2>
      <hr className={"divider divider-primary"} />
      <h3>{roomId}</h3>
    </section>
  );
};
