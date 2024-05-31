import { Loading } from "./Loading.tsx";

export const FullscreenMessage = ({
  message,
  loading = false,
}: {
  message: string;
  loading?: boolean;
}) => {
  return (
    <main className="w-screen h-screen flex justify-center items-center bg-[url('/img/background.svg')] bg-cover">
      <section
        className={
          "h-auto w-auto p-8 flex flex-col justify-center items-center bg-base-100 rounded-lg shadow-md text-center gap-4"
        }
      >
        <h1 className={"text-5xl"}>
          {loading && <Loading />} {message}
        </h1>
      </section>
    </main>
  );
};
