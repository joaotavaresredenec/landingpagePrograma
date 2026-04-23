import { redirect } from 'next/navigation'

export const metadata = {
  robots: { index: false, follow: false },
}

export default async function MateriaisRedirect({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }> | { token?: string }
}) {
  const params =
    typeof (searchParams as any)?.then === 'function'
      ? await (searchParams as Promise<{ token?: string }>)
      : (searchParams as { token?: string })

  if (params.token) {
    redirect(`/biblioteca?token=${encodeURIComponent(params.token)}`)
  }
  redirect('/biblioteca')
}
