'use client'; // since we're using usePathname, a hook 
import { cn } from "@/lib/utils";
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { label: 'Library', href: '/'},
  { label: 'Add New', href: '/books/new'}
]
const Navbar = () => {
  const pathName = usePathname();
  return (
    <header className="w-full fixed z-50 bg-('--bg-primary') text-('--text-primary')">
        <div className="flex justify-between items-center wrapper navbar-height py-4">
            <Link href="/" className="flex gap-1 items-center">
                <Image src='/assets/logo.png' alt='prompt page' width={42} height={26} />
                <span className='logo-text'>Prompt Page</span>
            </Link>

            <nav className="w-fit flex gap-8 items-center">
                {navItems.map(({ label, href }) => {
                  const isActive = (pathName ===  href) || (href !== '/' && pathName.startsWith(href))
                  return (
                    <Link 
                      href={href} 
                      key={label} 
                      className={cn('nav-link-base', 
                        isActive ? 'nav-link-active' :
                        'text-black hover:opacity-70'
                      )}
                    >
                      {label}
                    </Link>
                  )
                })}
            </nav>
        </div>
    </header>
  )
}

export default Navbar