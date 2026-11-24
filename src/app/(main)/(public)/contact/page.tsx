
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  ArrowRight,
  ChevronDown,
  CheckCircle,
  Headphones,
} from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";

const contactInfo = [
  {
    icon: Phone,
    title: "Call Us",
    description: "Mon - Sat, 9AM - 8PM",
    value: "+880 1234 567890",
    href: "tel:+8801234567890",
  },
  {
    icon: Mail,
    title: "Email Us",
    description: "We'll reply within 24 hours",
    value: "hello@wedplan.com",
    href: "mailto:hello@wedplan.com",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Come and say hello",
    value: "Dhaka, Bangladesh",
    href: "#location",
  },
];

const faqs = [
  {
    question: "How can I book a wedding vendor?",
    answer:
      "Browse our services, select your preferred vendor and send a booking request. The vendor will contact you to confirm the details.",
  },
  {
    question: "Can I become a vendor on WedPlan?",
    answer:
      "Yes! You can create a vendor account, add your services and showcase your wedding business to potential customers.",
  },
  {
    question: "How long does it take to get a response?",
    answer:
      "Our support team generally responds within 24 hours during business days.",
  },
  {
    question: "Can I change my booking details?",
    answer:
      "Yes. Contact our support team or communicate directly with your vendor to discuss booking changes.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <main className="min-h-screen bg-[#fffaf8] text-[#35101f]">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000')",
          }}
        />

        <div className="absolute inset-0 bg-[#35101f]/65" />

        <div className="relative mx-auto flex min-h-[330px] max-w-7xl items-center px-6 py-20 md:px-12">
          <div className="max-w-2xl text-white">
            <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[3px] text-[#f4c6d0]">
              <Heart size={15} />
              <span>We Are Here For You</span>
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">
              Let's Make Your
              <br />
              Dream Wedding
              <span className="text-[#f3bdca]"> Happen.</span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/85 md:text-base">
              Have questions about our wedding services? Need help
              finding the perfect vendor? We'd love to hear from you.
            </p>

            <div className="mt-7 flex items-center gap-2 text-sm">
              <Link href="/" className="text-white/70 hover:text-white">
                Home
              </Link>
              <span>/</span>
              <span className="font-semibold text-[#f4c6d0]">
                Contact Us
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative z-10 mx-auto -mt-12 max-w-7xl px-6 md:px-12">
        <div className="grid gap-5 md:grid-cols-3">
          {contactInfo.map((item, index) => {
            const Icon = item.icon;

            return (
              <a
                key={index}
                href={item.href}
                className="group rounded-2xl border border-[#f1dce1] bg-white p-6 shadow-lg shadow-[#5b1930]/5 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fbedf0] text-[#711b38] transition group-hover:bg-[#711b38] group-hover:text-white">
                    <Icon size={23} />
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.description}
                    </p>

                    <p className="mt-3 text-sm font-semibold text-[#711b38]">
                      {item.value}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <div className="grid gap-12 lg:grid-cols-2">

          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-[3px] text-[#a64d67]">
              Get In Touch
            </span>

            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">
              We'd Love To
              <br />
              <span className="text-[#8c2547]">Hear From You.</span>
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-8 text-gray-600">
              Whether you're planning your wedding, looking for
              trusted vendors, or interested in joining WedPlan,
              our friendly team is always ready to help.
            </p>

            {/* Support Card */}
            <div className="mt-9 rounded-2xl bg-[#f9e9ed] p-6 md:p-7">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#711b38] text-white">
                  <Headphones size={23} />
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold">
                    Need Immediate Help?
                  </h3>
                  <p className="mt-1 text-xs text-gray-600">
                    Our support team is ready to assist you.
                  </p>
                </div>
              </div>

              <a
                href="tel:+8801234567890"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#711b38] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4b1027]"
              >
                Call Our Support
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Social Links */}
            <div className="mt-9">
              <h4 className="mb-4 text-sm font-bold">
                Follow Us On Social Media
              </h4>

              <div className="flex gap-3">
                {[FaFacebook, BsInstagram, MessageCircle].map(
                  (Icon, index) => (
                    <a
                      key={index}
                      href="#"
                      aria-label={`Social link ${index + 1}`}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ead3da] bg-white text-[#711b38] transition hover:border-[#711b38] hover:bg-[#711b38] hover:text-white"
                    >
                      <Icon size={19} />
                    </a>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="rounded-3xl border border-[#f0dfe3] bg-white p-6 shadow-xl shadow-[#5b1930]/5 md:p-10">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[2px] text-[#a64d67]">
                Send A Message
              </span>

              <h3 className="mt-3 font-serif text-3xl font-bold">
                Get In Touch With Us
              </h3>

              <p className="mt-3 text-sm text-gray-500">
                Fill out the form below and we'll get back to you.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl bg-green-50 p-8 text-center">
                <CheckCircle
                  size={48}
                  className="mx-auto text-green-600"
                />
                <h4 className="mt-4 text-xl font-bold text-green-800">
                  Thank You!
                </h4>
                <p className="mt-2 text-sm text-green-700">
                  Your form was submitted successfully.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-5 text-sm font-semibold text-green-800 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-[#eadce0] bg-[#fffaf9] px-4 py-3 text-sm outline-none transition focus:border-[#8c2547] focus:ring-2 focus:ring-[#8c2547]/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-[#eadce0] bg-[#fffaf9] px-4 py-3 text-sm outline-none transition focus:border-[#8c2547] focus:ring-2 focus:ring-[#8c2547]/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Subject *
                  </label>

                  <select
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subject: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#eadce0] bg-[#fffaf9] px-4 py-3 text-sm outline-none transition focus:border-[#8c2547]"
                  >
                    <option value="">Select a subject</option>
                    <option value="Wedding Services">
                      Wedding Services
                    </option>
                    <option value="Booking Support">
                      Booking Support
                    </option>
                    <option value="Vendor Registration">
                      Vendor Registration
                    </option>
                    <option value="Payment Issue">
                      Payment Issue
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Your Message *
                  </label>

                  <textarea
                    required
                    rows={6}
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        message: e.target.value,
                      })
                    }
                    className="w-full resize-none rounded-xl border border-[#eadce0] bg-[#fffaf9] px-4 py-3 text-sm outline-none transition focus:border-[#8c2547] focus:ring-2 focus:ring-[#8c2547]/10"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 rounded-full bg-[#711b38] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#711b38]/20 transition hover:bg-[#4b1027]"
                >
                  Send Message
                  <Send size={17} />
                </button>

                <p className="text-center text-xs text-gray-400">
                  We respect your privacy. Your information is safe with us.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#f9edef] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-[3px] text-[#a64d67]">
              Got Questions?
            </span>

            <h2 className="mt-4 font-serif text-4xl font-bold">
              Frequently Asked Questions
            </h2>

            <p className="mt-4 text-sm text-gray-600">
              Find answers to some of the most common questions.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group rounded-2xl border border-[#eedce1] bg-white p-5 transition hover:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  <span className="text-sm md:text-base">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={20}
                    className="shrink-0 text-[#8c2547] transition group-open:rotate-180"
                  />
                </summary>

                <p className="mt-4 border-t border-[#f3e7ea] pt-4 text-sm leading-7 text-gray-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section
        id="location"
        className="mx-auto max-w-7xl px-6 py-20 md:px-12"
      >
        <div className="overflow-hidden rounded-3xl border border-[#f0dfe3] bg-white shadow-lg">
          <div className="grid md:grid-cols-2">
            <div className="flex flex-col justify-center p-8 md:p-12">
              <span className="text-xs font-bold uppercase tracking-[3px] text-[#a64d67]">
                Our Location
              </span>

              <h2 className="mt-4 font-serif text-3xl font-bold">
                Come Visit Us
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-600">
                We'd love to meet you! Visit our office and let's
                discuss how we can make your special day unforgettable.
              </p>

              <div className="mt-7 flex items-center gap-3">
                <MapPin className="text-[#8c2547]" />
                <span className="text-sm font-semibold">
                  Dhaka, Bangladesh
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Clock className="text-[#8c2547]" />
                <span className="text-sm font-semibold">
                  Saturday - Thursday, 9AM - 8PM
                </span>
              </div>
            </div>

            <div className="flex min-h-[300px] items-center justify-center bg-[#f6e6e9] p-8">
              <div className="text-center">
                <MapPin
                  size={45}
                  className="mx-auto text-[#711b38]"
                />
                <h3 className="mt-4 font-serif text-2xl font-bold">
                  WedPlan Office
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Dhaka, Bangladesh
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Dhaka+Bangladesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#711b38] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4b1027]"
                >
                  Get Directions
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
