"use client"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthState } from "@/lib/auth-context"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuthState()

  async function verifyCertificate(certId: string) {
    const response = await fetch("http://localhost:8000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tool: "echo",
        input: {
          message: "Hello from frontend",
        },
      }),
    });

    const data = await response.json();
    console.log(data);

    return data;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <nav className="border-b border-white/10 bg-white/70 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  SmartCertify
                </span>
                <div className="text-xs text-gray-500 font-medium">AI-Powered Verification</div>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium relative group"
              >
                How it Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
              </Link>
              <Link
                href="#pricing"
                className="text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium relative group"
              >
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
              </Link>
              <Link
                href="#contact"
                className="text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button
                onClick={() => router.push('/signin')}
                variant="ghost"
                size="sm"
                className="text-gray-700 cursor-pointer hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              >
                Sign In
              </Button>
              <Button
              onClick={() => router.push('/signup')}
                size="sm"
                className="bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 px-6"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Certificate Management
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Scan, Verify & Secure
            <br />
            Certificates with AI
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Revolutionary platform combining machine learning and blockchain technology to automatically scan
            certificates, extract data, and provide tamper-proof verification.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button onClick={() => verifyCertificate("djnvnjdvbhddbvvh")}  size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-8 py-6">
              <Upload className="w-5 h-5 mr-2" />
              Upload Certificate
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <Shield className="w-5 h-5 mr-2" />
              Verify Certificate
            </Button>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Scan className="w-6 h-6 text-blue-600" />
                      <span className="font-semibold">AI Certificate Scanner</span>
                    </div>
                    <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Upload className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Database className="w-6 h-6 text-purple-600" />
                      <span className="font-semibold">Blockchain Verification</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-blue-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-purple-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-green-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Certification</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of certificate management with our cutting-edge technology stack
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>AI-Powered OCR</CardTitle>
                <CardDescription>
                  Advanced machine learning algorithms automatically extract text and data from certificate images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    OpenCV image preprocessing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Tesseract OCR integration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Smart data parsing
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Blockchain Security</CardTitle>
                <CardDescription>
                  Immutable certificate storage on blockchain ensures tamper-proof verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Smart contract storage
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Cryptographic hashing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Instant verification
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Scan className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Smart Scanning</CardTitle>
                <CardDescription>
                  Upload certificate images and get structured data automatically extracted
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Multiple format support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Data validation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Manual review option
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Institution Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive dashboard for educational institutions to manage certificates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Bulk certificate processing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Student management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Analytics & reporting
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Secure Authentication</CardTitle>
                <CardDescription>JWT-based authentication system with role-based access control</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Institution accounts
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Student verification
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Secure API access
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Real-time Processing</CardTitle>
                <CardDescription>
                  Fast certificate processing with immediate blockchain storage and verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Instant OCR processing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Live verification
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Real-time updates
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How SmartCertify Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple 4-step process to digitize and secure your certificates
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Upload Image</h3>
              <p className="text-gray-600">Upload your certificate image in JPG or PNG format</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI Processing</h3>
              <p className="text-gray-600">Our ML algorithms extract and parse certificate data automatically</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Review & Confirm</h3>
              <p className="text-gray-600">Review extracted data and make any necessary corrections</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4. Blockchain Storage</h3>
              <p className="text-gray-600">Certificate is securely stored on blockchain for verification</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Revolutionize Certificate Management?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join educational institutions worldwide in adopting AI-powered certificate verification
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Upload className="w-5 h-5 mr-2" />
              Try Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600"
            >
              Contact Sales
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative">
          <div className="border-b border-gray-700/50 py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Stay Updated with SmartCertify
                </h3>
                <p className="text-gray-300 mb-8 text-lg">
                  Get the latest updates on AI-powered certificate management and blockchain verification
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 whitespace-nowrap">
                    Subscribe
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="py-16 px-4">
            <div className="container mx-auto">
              <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        SmartCertify
                      </span>
                      <div className="text-sm text-gray-400">AI-Powered Verification</div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                    Revolutionary platform combining machine learning and blockchain technology for secure, automated
                    certificate management and verification.
                  </p>

                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 group"
                    >
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 group"
                    >
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-all duration-200 group"
                    >
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-200 group"
                    >
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-6 text-white">Product</h4>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="#"
                        className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        AI Scanner
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        Blockchain Verification
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        API Documentation
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        Pricing
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-6 text-white">Solutions</h4>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="#"
                        className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        For Universities
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        For Employers
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        For Students
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        Enterprise
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        Integration
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-6 text-white">Support</h4>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="#"
                        className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        Help Center
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        System Status
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        Terms of Service
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700/50 py-8">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-gray-400 text-sm">
                  &copy; 2024 SmartCertify. All rights reserved. Built with AI and Blockchain technology.
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Security
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Compliance
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Accessibility
                  </Link>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>SOC 2 Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
