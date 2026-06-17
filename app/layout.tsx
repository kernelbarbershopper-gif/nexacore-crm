export const metadata = {
  title: 'NexaCore CRM',
  description: 'CRM Intelligence for Montana businesses',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}