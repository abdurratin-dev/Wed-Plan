import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
