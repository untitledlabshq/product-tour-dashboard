import Navbar from "./Navbar";

type Props = {
  children?: any;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
