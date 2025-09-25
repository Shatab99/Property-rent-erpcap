import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import logo from "../../../public/logo.png";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Image height={150} width={150} src={logo} alt="Logo" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Modern rentals you can trust. Find, tour, and apply in minutes.
          </p>
          <div className="mt-4 flex gap-3 text-muted-foreground">
            <a href="#" aria-label="Twitter" className="hover:text-foreground">
              <Twitter size={18} />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-foreground">
              <Facebook size={18} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-foreground"
            >
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-foreground">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground">
                Careers
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground">
                Press
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="#" className="hover:text-foreground">
                Blog
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground">
                Market Insights
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground">
                Guides
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="#" className="hover:text-foreground">
                Terms
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-foreground">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Rentora, Inc. All rights reserved.
      </div>
    </footer>
  );
}
