"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Shield,
  Scan,
  Brain,
  CheckCircle,
  Upload,
  Database,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  Lock,
  Zap,
  Star,
  TrendingUp,
  BarChart3,
  Globe,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const features = [
  {
    icon: Brain, title: "AI-Powered OCR", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100",
    desc: "Advanced machine learning algorithms automatically extract text and data from certificate images.",
    points: ["OpenCV image preprocessing", "Tesseract OCR integration", "Smart data parsing"],
  },
  {
    icon: Shield, title: "Blockchain Security", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100",
    desc: "Immutable certificate storage on blockchain ensures tamper-proof verification.",
    points: ["Smart contract storage", "Cryptographic hashing", "Instant verification"],
  },
  {
    icon: Scan, title: "Smart Scanning", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100",
    desc: "Upload certificate images and get structured data automatically extracted.",
    points: ["Multiple format support", "Data validation", "Manual review option"],
  },
  {
    icon: Users, title: "Institution Dashboard", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100",
    desc: "Comprehensive dashboard for educational institutions to manage certificates.",
    points: ["Bulk certificate processing", "Student management", "Analytics & reporting"],
  },
  {
    icon: Lock, title: "Secure Authentication", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100",
    desc: "JWT-based authentication system with role-based access control.",
    points: ["Institution accounts", "Student verification", "Secure API access"],
  },
  {
    icon: Zap, title: "Real-time Processing", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100",
    desc: "Fast certificate processing with immediate blockchain storage and verification.",
    points: ["Instant OCR processing", "Live verification", "Real-time updates"],
  },
]

const steps = [
  { icon: Upload, label: "Upload Image", desc: "Upload your certificate image in JPG or PNG format", color: "from-blue-500 to-blue-600", num: "01" },
  { icon: Brain, label: "AI Processing", desc: "Our ML algorithms extract and parse certificate data automatically", color: "from-indigo-500 to-indigo-600", num: "02" },
  { icon: CheckCircle, label: "Review & Confirm", desc: "Review extracted data and make any necessary corrections", color: "from-violet-500 to-violet-600", num: "03" },
  { icon: Shield, label: "Blockchain Storage", desc: "Certificate is securely stored on blockchain for verification", color: "from-emerald-500 to-emerald-600", num: "04" },
]

const stats = [
  { value: "2M+", label: "Certificates Issued", icon: Award },
  { value: "500+", label: "Institutions", icon: Globe },
  { value: "99.9%", label: "Uptime", icon: TrendingUp },
  { value: "<2s", label: "Avg Process Time", icon: Zap },
]

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-base font-bold text-slate-900 tracking-tight">SmartCertify</span>
                <div className="text-[10px] text-slate-400 leading-none mt-0.5 font-medium">AI-Powered Verification</div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              {["Features", "How it Works", "Pricing", "Contact"].map((item) => (
                <Link key={item} href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-150 relative group">
                  {item}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-200 rounded-full" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => router.push('/signin')} variant="ghost" size="sm"
                className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">
                Sign In
              </Button>
              <Button onClick={() => router.push('/signup')} size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-sm hover:shadow-md hover:shadow-blue-200 text-sm px-5 transition-all duration-200">
                Get Started
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 px-4">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:48px_48px] opacity-60" />
        {/* Gradient blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/60 to-indigo-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-violet-100/60 to-blue-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">AI-Powered Certificate Management Platform</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-[1.1] tracking-tight">
            Scan, Verify &
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Secure Certificates
            </span>
            <br />
            with AI
          </h1>

          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Revolutionary platform combining machine learning and blockchain technology to automatically scan
            certificates, extract data, and provide tamper-proof verification.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Button onClick={() => router.push('/signup')} size="lg"
              className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-blue-200 transition-all duration-200 text-sm">
              <Upload className="w-4 h-4 mr-2" />
              Get Started Free
            </Button>
            <Button size="lg" variant="outline"
              className="h-12 px-8 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-sm font-semibold">
              <Shield className="w-4 h-4 mr-2 text-indigo-500" />
              View Demo
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{s.value}</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 bg-slate-50/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-slate-200 text-slate-600 text-xs font-semibold mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Powerful Features for Modern Certification
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              Experience the future of certificate management with our cutting-edge technology stack
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <Card key={i} className={`border ${f.border} bg-white shadow-sm hover:shadow-md transition-all duration-200 group cursor-default`}>
                <CardHeader className="pb-3">
                  <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-4 border ${f.border} group-hover:scale-110 transition-transform duration-200`}>
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <CardTitle className="text-base font-bold text-slate-800">{f.title}</CardTitle>
                  <CardDescription className="text-sm text-slate-500">{f.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {f.points.map((p, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className={`w-4 h-4 ${f.color} flex-shrink-0`} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ─────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-slate-200 text-slate-600 text-xs font-semibold mb-4">Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">How SmartCertify Works</h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">Simple 4-step process to digitize and secure your certificates</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <div key={i} className="relative group">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 h-full">
                  <div className="text-xs font-bold text-slate-300 mb-4 tracking-widest">{s.num}</div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-2">{s.label}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Ready to Revolutionize Certificate Management?</h2>
          <p className="text-base text-blue-100 mb-8 max-w-xl mx-auto">Join educational institutions worldwide in adopting AI-powered certificate verification.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => router.push('/signup')}
              className="h-12 px-8 bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-md text-sm transition-all duration-200">
              <Upload className="w-4 h-4 mr-2" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline"
              className="h-12 px-8 border-blue-300/50 text-white hover:bg-white/10 text-sm font-semibold">
              Contact Sales
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="py-12 border-b border-slate-800">
            <div className="max-w-sm mx-auto text-center">
              <h3 className="text-base font-bold mb-2 text-white">Stay Updated</h3>
              <p className="text-sm text-slate-400 mb-4">Get the latest updates on AI certificate management</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Enter your email"
                  className="flex-1 px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 text-sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <div className="py-12 grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-bold text-white">SmartCertify</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">Revolutionary platform combining machine learning and blockchain for secure, automated certificate management.</p>
            </div>

            {[
              { title: "Product", links: ["Features", "AI Scanner", "Blockchain", "API Docs", "Pricing"] },
              { title: "Support", links: ["Help Center", "Contact Us", "Status", "Privacy", "Terms"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}><Link href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="py-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div>© 2024 SmartCertify. All rights reserved.</div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>SOC 2 Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
