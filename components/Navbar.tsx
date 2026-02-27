'use client';
import { cn } from "@/lib/utils";
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const navItems = [
  { label: 'Library', href: '/'},
  { label: 'Add New', href: '/books/new'}
]
const Navbar = () => {
  const pathName = usePathname();
  const { user } = useUser();
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

                <div className="flex gap-8 items-center">
                  <SignedOut>
                    <SignInButton mode="modal" />
                    {/* <SignUpButton /> */}
                  </SignedOut>
                  <SignedIn>
                    <div className="nav-user-link">
                      <UserButton />
                      {user?.firstName && (
                        <Link 
                          href="subscriptions"
                          className="class-user-name"
                        >
                          {user.firstName}
                        </Link>
                      )}
                    </div>
                  </SignedIn>
                </div>
            </nav>
        </div>
    </header>
  )
}

export default Navbar