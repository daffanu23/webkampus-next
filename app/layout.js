import { Poppins } from "next/font/google";
import "./globals.css";

// Konfigurasi Font Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"], // Ketebalan font yang dipakai
  variable: "--font-poppins",
});

export const metadata = {
  title: "LSP Teknologi Digital",
  description: "Portal Sertifikasi & Kampus",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${poppins.variable} font-sans bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}