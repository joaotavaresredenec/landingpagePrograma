import { redirect } from 'next/navigation'

export const metadata = {
  robots: { index: false, follow: false },
}

export default async function MaterialRedirect({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string }
}) {
  const { slug } = 'then' in params ? await params : params
  redirect(`/biblioteca/${slug}`)
}
