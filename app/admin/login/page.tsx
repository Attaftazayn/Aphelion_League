import { redirect } from 'next/navigation'

// Login has been moved to /login (outside the admin layout)
export default function AdminLoginRedirect() {
  redirect('/login')
}
