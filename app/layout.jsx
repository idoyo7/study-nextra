import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: {
    default: 'Kubernetes Study',
    template: '%s – Kubernetes Study'
  },
  description: 'Kubernetes 스터디 문서'
}

const navbar = <Navbar logo={<b>Kubernetes Study</b>} />
const footer = <Footer>Kubernetes Study</Footer>

export default async function RootLayout({ children }) {
  return (
    <html lang="ko" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          footer={footer}
          editLink={null}
          feedback={{ content: null }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
