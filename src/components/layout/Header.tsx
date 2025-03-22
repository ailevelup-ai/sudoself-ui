'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Bell, Search, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = pathname === href;
    return (
      <Link 
        href={href} 
        className={`px-3 py-2 text-sm font-medium rounded-md transition ${
          isActive 
            ? 'bg-primary/10 text-primary' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container px-4 mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Mobile Menu Button */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold">SudoSelf</span>
              </Link>
            </div>
            <div className="md:hidden ml-4">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink href="/" label="Dashboard" />
            <NavLink href="/library" label="Library" />
            <NavLink href="/history" label="History" />
            <NavLink href="/settings" label="Settings" />
          </nav>

          {/* Right Side Nav - Search, Notifications, Profile */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center gap-2 p-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <UserCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container px-4 mx-auto py-3 space-y-1">
            <Link 
              href="/" 
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                pathname === '/' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/library" 
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                pathname === '/library' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Library
            </Link>
            <Link 
              href="/history" 
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                pathname === '/history' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              History
            </Link>
            <Link 
              href="/settings" 
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                pathname === '/settings' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
} 