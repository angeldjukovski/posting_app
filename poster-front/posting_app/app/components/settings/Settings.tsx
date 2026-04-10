'use client'
import Link from "next/link"

export const Settings = () => {
return (
  <div className="drawer-side">
    <label htmlFor="my-drawer-1" aria-label="close sidebar" className="drawer-overlay"></label>
    <ul className="menu bg-base-200 min-h-full w-80 p-4">
     
      <li><Link href={'/settings/account-information'} className="hoover:text-blue-500">Account Information</Link></li>
      <li><Link href={'/settings/change-password'}>Change-Passoword</Link></li>
      <li><Link href={'/settings/privacy'}>Privacy</Link></li>
      
    </ul>
  </div>

)
}