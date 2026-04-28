"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { GoogleLogin } from "@react-oauth/google"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Award, Shield, ArrowRight, Eye, EyeOff, Lock, Mail,
  AlertCircle, Loader2, CheckCircle, Star,
} from "lucide-react"
import Link from "next/link"
import { useAuthForm } from "@/lib/auth-context"
import { signupSchema, SignupFormData } from "@/lib/auth-types"
import { isApiError } from "@/lib/auth-api"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const router = useRouter()
  const { signup, googleAuth, isLoading } = useAuthForm()

  const { register, handleSubmit, formState: { errors }, setError: setFormError, clearErrors } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      usertype: "STUDENT" as const,
      firstname: "",
      lastname: "",
      email: "",
      username: "",
      password: ""
    }
  })

  const onSubmit = async (data: SignupFormData) => {
    if (!agreedToTerms) { setError("Please agree to the Terms of Service and Privacy Policy"); return }
    try {
      setError(null); clearErrors()
      // Always send STUDENT as usertype (no institution UI needed)
      await signup({ ...data, usertype: "STUDENT" })
      router.push("/dashboard")
    } catch (error) {
      if (isApiError(error)) {
        if (error.errors && error.errors.length > 0) {
          error.errors.forEach(err => { if (err.field) setFormError(err.field as keyof SignupFormData, { type: "server", message: err.message }) })
        } else { setError(error.message) }
      } else { setError("An unexpected error occurred. Please try again.") }
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
          <span className="text-sm text-slate-500">Already have an account?</span>
          <Link href="/signin">
            <Button variant="outline" size="sm" className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold h-8 px-4">Sign In</Button>
          </Link>
        </div>
      </nav>

      <div className="flex-1 grid lg:grid-cols-2">
        {/* Left branding panel */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-50 to-indigo-50/40 px-12 py-16 border-r border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1.5 mb-8">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-indigo-700">Join 500+ Institutions Worldwide</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 leading-tight mb-4">
              Verify Certificates with <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI Power</span>
            </h1>
            <p className="text-slate-500 text-base leading-relaxed max-w-sm mb-8">
              Create your free account and start verifying certificate authenticity in seconds using our AI-powered platform.
            </p>
            <div className="space-y-3">
              {[
                "AI-powered fraud detection & OCR",
                "Blockchain-secured tamper-proof records",
                "Image forensic analysis in seconds",
                "Smart similarity & duplicate checking",
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-sm text-slate-700">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-sm text-slate-700 italic mb-3">"SmartCertify detected a fraudulent certificate in under 2 seconds. Incredible technology."</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">RK</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800">Rahul Kumar</div>
                <div className="text-xs text-slate-400">HR Director, TCS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Signup form */}
        <div className="flex items-start justify-center px-6 py-12 lg:px-16 overflow-y-auto">
          <div className="w-full max-w-[400px] space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
              <p className="text-sm text-slate-500 mt-1.5">Start verifying certificates for free. No credit card required.</p>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    setError(null)
                    if (credentialResponse.credential) { await googleAuth({ idToken: credentialResponse.credential }); router.push("/dashboard") }
                  } catch { setError("Failed to create account with Google") }
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
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">First Name</Label>
                  <Input id="firstName" placeholder="John" className="h-10 border-slate-200 bg-slate-50 focus:bg-white text-sm" {...register("firstname")} />
                  {errors.firstname && <p className="text-xs text-red-600">{errors.firstname.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" className="h-10 border-slate-200 bg-slate-50 focus:bg-white text-sm" {...register("lastname")} />
                  {errors.lastname && <p className="text-xs text-red-600">{errors.lastname.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input id="email" type="email" placeholder="john@example.com" className="h-10 pl-9 border-slate-200 bg-slate-50 focus:bg-white text-sm" {...register("email")} />
                </div>
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Username</Label>
                <Input id="username" placeholder="johndoe123" className="h-10 border-slate-200 bg-slate-50 focus:bg-white text-sm" {...register("username")} />
                {errors.username && <p className="text-xs text-red-600">{errors.username.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min 8 chars, upper, lower, number, symbol"
                    className="h-10 pl-9 pr-10 border-slate-200 bg-slate-50 focus:bg-white text-sm" {...register("password")} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
              </div>

              <div className="flex items-start gap-2.5">
                <Checkbox id="terms" className="mt-0.5" checked={agreedToTerms} onCheckedChange={(c) => setAgreedToTerms(c as boolean)} />
                <Label htmlFor="terms" className="text-xs text-slate-600 leading-relaxed font-normal">
                  I agree to SmartCertify's <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                </Label>
              </div>

              <Button type="submit" disabled={isLoading || !agreedToTerms}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-blue-200 transition-all duration-200 disabled:opacity-50">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-200/60 rounded-xl">
              <Shield className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-emerald-700"><span className="font-semibold">Your data is secure.</span> Enterprise-grade encryption. We never share your information.</p>
            </div>

            <p className="text-center text-sm text-slate-500">
              Already have an account? <Link href="/signin" className="text-blue-600 hover:text-blue-700 font-semibold">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
