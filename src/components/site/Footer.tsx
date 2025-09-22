import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary" />
            <span className="font-extrabold tracking-tight text-xl text-primary">
              Rentora
            </span>
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
              <Link to="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-foreground">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground">
                Press
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#" className="hover:text-foreground">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground">
                Market Insights
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground">
                Guides
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#" className="hover:text-foreground">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground">
                Privacy
              </a>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
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
