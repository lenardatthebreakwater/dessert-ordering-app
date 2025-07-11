import type React from "react"
import type { Metadata } from "next"
import { Red_Hat_Text } from "next/font/google"
import "./globals.css"

const redHatText = Red_Hat_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

export const metadata: Metadata = {
  title: "Dessert Ordering App",
  description: "Order delicious desserts online",
  icons: {
    icon: "/assets/images/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={redHatText.className}>{children}</body>
    </html>
  )
}
