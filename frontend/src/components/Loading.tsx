import MoonLoader from "react-spinners/MoonLoader";

export default function Loading({ loading }: { loading: boolean }) {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex justify-center items-center`}
    >
      <MoonLoader color="#FAA0A0	" loading={loading} size={150} />
    </div>
  );
}