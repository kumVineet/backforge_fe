import { Navigation } from "./navigation";
import { Footer } from "./footer";

interface NavigationCustomization {
  backgroundColor?: string;
  content?: React.ReactNode;
  showLogo?: boolean;
  logoText?: string;
}

interface LayoutProps {
  children: React.ReactNode;
  navigation?: NavigationCustomization;
}

export function Layout({ children, navigation }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20"></div>

      <Navigation customization={navigation} />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
