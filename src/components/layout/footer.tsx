
import Link from "next/link";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram, BsYoutube } from "react-icons/bs";
import { IconType } from "react-icons";

type FooterLink = {
  label: string;
  href: string;
};

type ContactItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
};

type SocialItem = {
  icon: IconType;
  href: string;
  label: string;
};

const quickLinks: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Become a Vendor", href: "/sign-up" },
];

const serviceLinks: FooterLink[] = [
  { label: "Photography", href: "/services" },
  { label: "Decoration", href: "/services" },
  { label: "Catering", href: "/services" },
  { label: "Bridal Makeup", href: "/services" },
  { label: "Wedding Venues", href: "/services" },
];

const contactItems: ContactItem[] = [
  {
    icon: Mail,
    label: "EMAIL",
    value: "hello@wedplan.com",
    href: "mailto:hello@wedplan.com",
  },
  {
    icon: Phone,
    label: "PHONE",
    value: "+880 1234 567890",
    href: "tel:+8801234567890",
  },
  {
    icon: MapPin,
    label: "ADDRESS",
    value: "Dhaka, Bangladesh",
    href: "https://maps.google.com/?q=Dhaka+Bangladesh",
  },
];

const socialLinks: SocialItem[] = [
  {
    icon: FaFacebook,
    href: "https://facebook.com",
    label: "Facebook",
  },
  {
    icon: BsInstagram,
    href: "https://instagram.com",
    label: "Instagram",
  },
  {
    icon: BsYoutube,
    href: "https://youtube.com",
    label: "YouTube",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#efd5d6] bg-[#fff8f6] transition-colors duration-300 dark:border-white/10 dark:bg-[#160d11]">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#f8dadd]/30 blur-3xl dark:bg-[#800d35]/10" />

      <div className="relative mx-auto max-w-7xl px-5 pt-14 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">

            <Link href="/" className="mb-5 inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#800d35] text-white shadow-md shadow-[#800d35]/20">
                <Heart size={21} strokeWidth={2} />
              </span>

              <span className="font-serif text-2xl font-bold text-[#590d26] dark:text-[#ffe2e9]">
                WedPlan
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-[#725b62] dark:text-[#bba7ae]">
              Your perfect wedding starts here. Discover trusted
              vendors, explore beautiful services and make your
              special day unforgettable.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-2.5">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8c5c8] text-[#800d35] transition-all duration-300 hover:-translate-y-1 hover:border-[#800d35] hover:bg-[#800d35] hover:text-white focus-visible:ring-2 focus-visible:ring-[#720e32]/40 active:scale-95 dark:border-white/15 dark:text-[#f08ba8] dark:hover:border-[#800d35] dark:hover:bg-[#800d35] dark:hover:text-white dark:focus-visible:ring-[#ff9bb9]/40"
                  >
                    <Icon size={17} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-extrabold uppercase tracking-wider text-[#590d26] dark:text-[#ffe2e9]">
              Quick Links
            </h3>

            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-[#725b62] transition-colors hover:text-[#800d35] dark:text-[#bba7ae] dark:hover:text-[#f08ba8]"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6 text-sm font-extrabold uppercase tracking-wider text-[#590d26] dark:text-[#ffe2e9]">
              Our Services
            </h3>

            <ul className="space-y-3.5">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-[#725b62] transition-colors hover:text-[#800d35] dark:text-[#bba7ae] dark:hover:text-[#f08ba8]"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-sm font-extrabold uppercase tracking-wider text-[#590d26] dark:text-[#ffe2e9]">
              Contact Us
            </h3>

            <div className="space-y-5">
              {contactItems.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="group flex items-center gap-3"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f8dadd] text-[#800d35] transition-colors group-hover:bg-[#800d35] group-hover:text-white dark:bg-[#800d35]/20 dark:text-[#f08ba8] dark:group-hover:bg-[#800d35] dark:group-hover:text-white">
                      <Icon size={17} />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-[10px] font-semibold tracking-wider text-[#987b83] dark:text-[#aa929b]">
                        {item.label}
                      </span>

                      <span className="mt-1 block break-words text-sm text-[#725b62] transition-colors group-hover:text-[#800d35] dark:text-[#bba7ae] dark:group-hover:text-[#f08ba8]">
                        {item.value}
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#e8d3d2] py-6 dark:border-white/10 sm:flex-row">

          <p className="text-center text-xs text-[#987b83] dark:text-[#aa929b]">
            © {new Date().getFullYear()} WedPlan. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-[#987b83] dark:text-[#aa929b]">
            <a
              href="https://github.com/abdurratin-dev"
              target="_blank"
              className="transition-colors hover:text-[#800d35] dark:hover:text-[#f08ba8]"
            >
              Made by Abdur Ratin
            </a>
          </div>

          <p className="flex items-center gap-1.5 text-xs text-[#987b83] dark:text-[#aa929b]">
            Made with
            <Heart size={13} className="fill-[#800d35] text-[#800d35] dark:fill-[#f08ba8] dark:text-[#f08ba8]" />
            for your special day.
          </p>

        </div>
      </div>
    </footer>
  );
}
