"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { GoogleLogin } from "@react-oauth/google"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Award,
  Shield,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Brain,
  Zap,
  Users,
  AlertCircle,
  Loader2,
  CheckCircle,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useAuthForm } from "@/lib/auth-context"
import { signinSchema, SigninFormData } from "@/lib/auth-types"
import { isApiError } from "@/lib/auth-api"

const features = [
  { icon: Brain, label: "AI-Powered OCR", desc: "Extract certificate data automatically", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Shield, label: "Blockchain Security", desc: "Tamper-proof verification system", color: "text-indigo-600", bg: "bg-indigo-50" },
  { icon: Zap, label: "Instant Processing", desc: "Real-time certificate verification", color: "text-violet-600", bg: "bg-violet-50" },
  { icon: Users, label: "Multi-User Dashboard", desc: "Manage teams and permissions", color: "text-emerald-600", bg: "bg-emerald-50" },
]

export default function SigninPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { signin, googleAuth, isLoading } = useAuthForm()

  const { register, handleSubmit, formState: { errors }, setError: setFormError, clearErrors } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema)
  })

  const onSubmit = async (data: SigninFormData) => {
    try {
      setError(null)
      clearErrors()
      await signin(data)
      router.push("/dashboard")
    } catch (error) {
      if (isApiError(error)) {
        if (error.errors && error.errors.length > 0) {
          error.errors.forEach(err => {
            if (err.field) setFormError(err.field as keyof SigninFormData, { type: "server", message: err.message })
          })
        } else {
          setError(error.message)
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <Award className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-slate-800 tracking-tight">SmartCertify</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Don't have an account?</span>
          <Link href="/signup">
            <Button variant="outline" size="sm" className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold h-8 px-4">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>

      <div className="flex-1 grid lg:grid-cols-2">
        {/* Left — Branding panel */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-50 to-blue-50/40 px-12 py-16 border-r border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3 py-1.5 mb-8">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-blue-700">Enterprise Certificate Platform</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 leading-tight mb-4">
              Welcome back to<br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SmartCertify</span>
            </h1>
            <p className="text-slate-500 text-base leading-relaxed max-w-sm">
              The world's most trusted AI-powered certificate verification platform. Trusted by 500+ institutions worldwide.
            </p>
          </div>

          {/* Feature tiles */}
          <div className="grid grid-cols-2 gap-3">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className={`w-9 h-9 ${f.bg} rounded-xl flex items-center justify-center mb-3 border border-${f.color.split('-')[1]}-100`}>
                  <f.icon className={`w-4.5 h-4.5 ${f.color}`} />
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-0.5">{f.label}</p>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200/60">
            {[
              { value: "2M+", label: "Certificates" },
              { value: "99.9%", label: "Uptime" },
              { value: "500+", label: "Institutions" },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{s.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Sign in form */}
        <div className="flex items-center justify-center px-6 py-12 lg:px-16">
          <div className="w-full max-w-[400px] space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
              <p className="text-sm text-slate-500 mt-1.5">Enter your credentials to access your dashboard</p>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {/* Google Auth */}
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    setError(null)
                    if (credentialResponse.credential) {
                      await googleAuth({ idToken: credentialResponse.credential })
                      router.push("/dashboard")
                    }
                  } catch {
                    setError("Failed to authenticate with Google")
                  }
                }}
                onError={() => setError("Google authentication failed")}
                useOneTap theme="outline" size="large" width="100%"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center text-xs"><span className="px-3 bg-white text-slate-400 font-medium">Or continue with email</span></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="email" type="email" placeholder="john@university.edu"
                    className="h-11 pl-9 border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-blue-100 text-sm"
                    {...register("email")}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                    className="h-11 pl-9 pr-10 border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-blue-100 text-sm"
                    {...register("password")}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={(c) => setRememberMe(c as boolean)} />
                <Label htmlFor="remember" className="text-sm text-slate-600 font-normal">Remember me for 30 days</Label>
              </div>

              <Button type="submit" disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-blue-200 transition-all duration-200">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Security Badge */}
            <div className="flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-200/60 rounded-xl">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-emerald-700"><span className="font-semibold">Secured.</span> Enterprise-grade encryption and multi-factor authentication protect your account.</p>
            </div>

            <p className="text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">Sign up for free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
