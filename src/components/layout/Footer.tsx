import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t py-6 bg-background">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">SudoSelf</h3>
            <p className="text-sm text-muted-foreground">
              Advanced document ingestion platform for your digital twin. Upload, process, and access your data with ease.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-muted-foreground hover:text-foreground transition">
                  Document History
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-muted-foreground hover:text-foreground transition">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-muted-foreground hover:text-foreground transition">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                Email: contact@sudoself.com
              </li>
              <li className="text-muted-foreground">
                Phone: +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} SudoSelf. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 