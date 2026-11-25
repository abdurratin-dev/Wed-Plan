import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/toast";


export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
      <main className="min-h-full flex flex-col">
          <Navbar />
          {children}
          <Footer />
      </main>
  );
}
