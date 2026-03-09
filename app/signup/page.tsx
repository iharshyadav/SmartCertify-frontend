"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { GoogleLogin } from "@react-oauth/google"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Award,
  Shield,
  Users,
  ArrowRight,
  Eye,
  EyeOff,
  Building,
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  Star,
  Zap,
  Brain,
  AlertCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import React from "react"
import { useAuthForm } from "@/lib/auth-context"
import { signupSchema, SignupFormData } from "@/lib/auth-types"
import { isApiError } from "@/lib/auth-api"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const router = useRouter()
  const { signup, googleAuth, isLoading } = useAuthForm()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    clearErrors,
    watch,
    setValue
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      usertype: "INSTITUTION",
      firstname: "",
      lastname: "",
      email: "",
      username: "",
      password: "",
      institutionname: ""
    }
  })

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const onSubmit = async (data: SignupFormData) => {
    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy")
      return
    }

    try {
      setError(null)
      clearErrors()

      await signup(data)

      router.push("/dashboard")
    } catch (error) {
      console.error("Signup error:", error)

      if (isApiError(error)) {
        if (error.errors && error.errors.length > 0) {
          error.errors.forEach(err => {
            if (err.field) {
              setFormError(err.field as keyof SignupFormData, {
                type: "server",
                message: err.message
              })
            }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <nav className="border-b border-white/10 bg-white/70 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  SmartCertify
                </span>
                <div className="text-xs text-gray-500 font-medium">AI-Powered Verification</div>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Already have an account?</span>
              <Link href="/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-120px)]">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium w-fit">
                <Sparkles className="w-4 h-4 mr-2" />
                Join 500+ Institutions Worldwide
              </Badge>

              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                Transform Certificate Management with AI
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Join thousands of educational institutions using SmartCertify to issue, verify, and manage certificates
                with cutting-edge AI and blockchain technology.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">AI-Powered OCR</h3>
                <p className="text-sm text-gray-600">Automatically extract certificate data</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Blockchain Security</h3>
                <p className="text-sm text-gray-600">Tamper-proof verification system</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Instant Processing</h3>
                <p className="text-sm text-gray-600">Real-time certificate verification</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Multi-User Dashboard</h3>
                <p className="text-sm text-gray-600">Manage teams and permissions</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-bold text-white">H</span>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-bold text-white">M</span>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-bold text-white">S</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">+500</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Trusted by leading institutions</p>
                  <p className="text-sm text-gray-600">Harvard, MIT, Stanford and 500+ more</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2M+</div>
                  <div className="text-sm text-gray-600">Certificates Issued</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">500+</div>
                  <div className="text-sm text-gray-600">Institutions</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">JD</span>
                </div>
                <div>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-2">
                    "SmartCertify revolutionized our certificate management. The AI scanning feature saved us hundreds
                    of hours of manual data entry."
                  </p>
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">Dr. Jane Davis</div>
                    <div className="text-gray-600">Registrar, Stanford University</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:pl-8">
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-4 pb-6">
                <div className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-900">Create Institution Account</CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    Start your free trial today. No credit card required.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3 flex justify-center w-full">
                  <div className="w-full flex justify-center items-center">
                    <GoogleLogin
                      onSuccess={async (credentialResponse) => {
                        try {
                          setError(null)
                          if (credentialResponse.credential) {
                            await googleAuth({ idToken: credentialResponse.credential })
                            router.push("/dashboard")
                          }
                        } catch (error) {
                          console.error("Google auth error:", error)
                          setError("Failed to create account with Google")
                        }
                      }}
                      onError={() => {
                        setError("Google authentication failed")
                      }}
                      useOneTap
                      theme="outline"
                      size="large"
                      width="100%"
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <input type="hidden" {...register("usertype")} value="INSTITUTION" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        {...register("firstname")}
                      />
                      {errors.firstname && (
                        <p className="text-sm text-red-600">{errors.firstname.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        {...register("lastname")}
                      />
                      {errors.lastname && (
                        <p className="text-sm text-red-600">{errors.lastname.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@university.edu"
                        className="h-11 pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Username
                    </Label>
                    <Input
                      id="username"
                      placeholder="johndoe123"
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...register("username")}
                    />
                    {errors.username && (
                      <p className="text-sm text-red-600">{errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution" className="text-sm font-medium text-gray-700">
                      Institution Name
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="institution"
                        placeholder="Harvard University"
                        className="h-11 pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        {...register("institutionname")}
                      />
                    </div>
                    {errors.institutionname && (
                      <p className="text-sm text-red-600">{errors.institutionname.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="h-11 pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600">{errors.password.message}</p>
                    )}
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Password must contain:</p>
                      <ul className="list-disc list-inside space-y-0.5 ml-2">
                        <li>At least 8 characters</li>
                        <li>One uppercase letter</li>
                        <li>One number or special character</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      className="mt-1"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                      I agree to SmartCertify's{" "}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox id="marketing" className="mt-1" />
                    <Label htmlFor="marketing" className="text-sm text-gray-600">
                      Send me product updates and educational content (optional)
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !agreedToTerms}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <ArrowRight className="w-5 h-5 mr-2" />
                    )}
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-green-800 mb-1">Your data is secure</p>
                      <p className="text-green-700">
                        We use enterprise-grade encryption and never share your information with third parties.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
