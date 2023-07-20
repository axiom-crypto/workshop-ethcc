import './globals.css'
import satoshi from 'next/font/local';
import type { Metadata } from 'next'
import Providers from './providers'

const Satoshi = satoshi({
  src: '../../public/fonts/Satoshi-Variable.ttf',
  display: "swap",
  weight: "500 700",
  variable: "--font-satoshi",
});

export const metadata: Metadata = {
  title: 'Distributor',
  description: 'Mint an NFT if your account is old enough.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${Satoshi.className} ${Satoshi.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
