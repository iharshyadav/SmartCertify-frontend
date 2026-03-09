"use client"

import { useState, useRef } from "react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
    Shield,
    ShieldAlert,
    ShieldCheck,
    ImageIcon,
    GitCompare,
    MessageSquare,
    Send,
    Upload,
    Loader2,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Brain,
    Sparkles,
    Info,
    Zap,
} from "lucide-react"
import { mlApi, FraudResult, ImageAnalysisResult, SimilarityResult, ChatResult } from "@/lib/ml-api"

// ─── Risk Level Colors ─────────────────────────────────────────
function getRiskColor(level: string) {
    switch (level) {
        case "LOW": return "bg-emerald-500"
        case "MEDIUM": return "bg-amber-500"
        case "HIGH": return "bg-orange-500"
        case "CRITICAL": return "bg-red-500"
        default: return "bg-gray-500"
    }
}
function getRiskBg(level: string) {
    switch (level) {
        case "LOW": return "bg-emerald-50 text-emerald-700 border-emerald-200"
        case "MEDIUM": return "bg-amber-50 text-amber-700 border-amber-200"
        case "HIGH": return "bg-orange-50 text-orange-700 border-orange-200"
        case "CRITICAL": return "bg-red-50 text-red-700 border-red-200"
        default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
}

// ─── Fraud Detection Tab ───────────────────────────────────────
function FraudDetectionTab() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<FraudResult | null>(null)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setResult(null)

        const fd = new FormData(e.currentTarget)
        try {
            const data = await mlApi.verifyCertificate({
                issuer_name: fd.get("issuer_name") as string,
                recipient_name: fd.get("recipient_name") as string,
                course_name: fd.get("course_name") as string,
                issue_date: fd.get("issue_date") as string,
                expiry_date: fd.get("expiry_date") as string || undefined,
                issuer_reputation_score: fd.get("reputation") ? Number(fd.get("reputation")) : undefined,
                template_match_score: fd.get("template") ? Number(fd.get("template")) : undefined,
                metadata_completeness_score: fd.get("metadata") ? Number(fd.get("metadata")) : undefined,
            })
            setResult(data)
        } catch (err: any) {
            setError(err.message || "Verification failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle>Certificate Verification</CardTitle>
                            <CardDescription>Enter certificate details to check for fraud</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="issuer_name">Issuer Name *</Label>
                                <Input id="issuer_name" name="issuer_name" placeholder="e.g. MIT, Coursera" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="recipient_name">Recipient Name *</Label>
                                <Input id="recipient_name" name="recipient_name" placeholder="John Doe" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="course_name">Course / Certificate Name *</Label>
                            <Input id="course_name" name="course_name" placeholder="Machine Learning Fundamentals" required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="issue_date">Issue Date *</Label>
                                <Input id="issue_date" name="issue_date" type="date" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expiry_date">Expiry Date</Label>
                                <Input id="expiry_date" name="expiry_date" type="date" />
                            </div>
                        </div>

                        <Separator />
                        <p className="text-xs text-gray-500 flex items-center gap-1"><Info className="w-3 h-3" /> Optional scores (0.0 – 1.0) for more accurate results</p>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="reputation" className="text-xs">Reputation</Label>
                                <Input id="reputation" name="reputation" type="number" step="0.01" min="0" max="1" placeholder="0.85" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="template" className="text-xs">Template Match</Label>
                                <Input id="template" name="template" type="number" step="0.01" min="0" max="1" placeholder="0.90" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="metadata" className="text-xs">Metadata</Label>
                                <Input id="metadata" name="metadata" type="number" step="0.01" min="0" max="1" placeholder="0.88" />
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-11" disabled={loading}>
                            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : <><Zap className="w-4 h-4 mr-2" /> Verify Certificate</>}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-4">
                {error && (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="pt-6 flex items-center gap-3">
                            <XCircle className="w-5 h-5 text-red-500" />
                            <p className="text-red-700">{error}</p>
                        </CardContent>
                    </Card>
                )}

                {result && (
                    <>
                        {/* Main Result Card */}
                        <Card className={`border-2 shadow-lg ${result.is_authentic ? "border-emerald-200" : "border-red-200"}`}>
                            <CardContent className="pt-6">
                                <div className="text-center space-y-4">
                                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${result.is_authentic ? "bg-emerald-100" : "bg-red-100"}`}>
                                        {result.is_authentic ? <ShieldCheck className="w-10 h-10 text-emerald-600" /> : <ShieldAlert className="w-10 h-10 text-red-600" />}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">{result.is_authentic ? "Authentic" : "Potentially Fraudulent"}</h3>
                                        <Badge className={`mt-2 ${getRiskBg(result.risk_level)}`}>{result.risk_level} RISK</Badge>
                                    </div>

                                    {/* Probability Bar */}
                                    <div className="space-y-2 pt-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Fraud Probability</span>
                                            <span className="font-semibold">{(result.fraud_probability * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div className={`h-3 rounded-full transition-all duration-1000 ${getRiskColor(result.risk_level)}`} style={{ width: `${result.fraud_probability * 100}%` }} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500">Confidence</p>
                                            <p className="text-lg font-bold">{(result.confidence_score * 100).toFixed(1)}%</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500">Model</p>
                                            <p className="text-lg font-bold capitalize">{result.model_used.replace("_", " ")}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Risk Flags */}
                        {result.risk_flags.length > 0 && (
                            <Card className="border-amber-200 bg-amber-50/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-600" /> Risk Flags</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {result.risk_flags.map((flag, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm text-amber-800">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                                            {flag}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        <p className="text-xs text-gray-400 text-center">Response time: {result.latency_ms?.toFixed(0) || "N/A"}ms</p>
                    </>
                )}

                {!result && !error && (
                    <Card className="border-dashed border-2 border-gray-200">
                        <CardContent className="pt-6">
                            <div className="text-center py-12 text-gray-400">
                                <Brain className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                <p className="text-lg font-medium">Verification results will appear here</p>
                                <p className="text-sm mt-1">Fill in the form and click Verify</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

// ─── Image Analysis Tab ────────────────────────────────────────
function ImageAnalysisTab() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<ImageAnalysisResult | null>(null)
    const [error, setError] = useState("")
    const [preview, setPreview] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => setPreview(reader.result as string)
        reader.readAsDataURL(file)
    }

    const handleAnalyze = async () => {
        if (!preview) return
        setLoading(true)
        setError("")
        setResult(null)

        try {
            const base64 = preview.split(",")[1]
            const data = await mlApi.analyzeImage({ image_base64: base64, certificate_id: "user-upload" })
            setResult(data)
        } catch (err: any) {
            setError(err.message || "Analysis failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-pink-600 rounded-xl flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle>Image Tampering Detection</CardTitle>
                            <CardDescription>Upload a certificate image to analyze</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div
                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all"
                        onClick={() => fileRef.current?.click()}
                    >
                        {preview ? (
                            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
                        ) : (
                            <div className="space-y-3">
                                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                                <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
                            </div>
                        )}
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>

                    <Button onClick={handleAnalyze} className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 h-11" disabled={loading || !preview}>
                        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : <><Sparkles className="w-4 h-4 mr-2" /> Analyze Image</>}
                    </Button>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {error && (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="pt-6 flex items-center gap-3"><XCircle className="w-5 h-5 text-red-500" /><p className="text-red-700">{error}</p></CardContent>
                    </Card>
                )}
                {result && (
                    <Card className={`border-2 shadow-lg ${result.is_tampered ? "border-red-200" : "border-emerald-200"}`}>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${result.is_tampered ? "bg-red-100" : "bg-emerald-100"}`}>
                                    {result.is_tampered ? <XCircle className="w-10 h-10 text-red-600" /> : <CheckCircle className="w-10 h-10 text-emerald-600" />}
                                </div>
                                <h3 className="text-2xl font-bold">{result.is_tampered ? "Tampering Detected" : "No Tampering Detected"}</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tamper Probability</span>
                                        <span className="font-semibold">{(result.tamper_probability * 100).toFixed(1)}%</span>
                                    </div>
                                    <Progress value={result.tamper_probability * 100} className="h-3" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500">Confidence</p>
                                        <p className="text-lg font-bold">{(result.confidence * 100).toFixed(1)}%</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500">Method</p>
                                        <p className="text-lg font-bold capitalize">{result.method.replace("_", " ")}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
                {!result && !error && (
                    <Card className="border-dashed border-2 border-gray-200">
                        <CardContent className="pt-6"><div className="text-center py-12 text-gray-400"><ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" /><p className="text-lg font-medium">Analysis results will appear here</p></div></CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

// ─── Similarity Tab ────────────────────────────────────────────
function SimilarityTab() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<SimilarityResult | null>(null)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setResult(null)

        const fd = new FormData(e.currentTarget)
        try {
            const data = await mlApi.checkSimilarity({
                cert_a: {
                    issuer_name: fd.get("a_issuer") as string,
                    recipient_name: fd.get("a_recipient") as string,
                    course_name: fd.get("a_course") as string,
                },
                cert_b: {
                    issuer_name: fd.get("b_issuer") as string,
                    recipient_name: fd.get("b_recipient") as string,
                    course_name: fd.get("b_course") as string,
                },
            })
            setResult(data)
        } catch (err: any) {
            setError(err.message || "Similarity check failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[{ prefix: "a", label: "Certificate A" }, { prefix: "b", label: "Certificate B" }].map(({ prefix, label }) => (
                        <Card key={prefix} className="border-0 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${prefix === "a" ? "bg-gradient-to-br from-blue-600 to-cyan-600" : "bg-gradient-to-br from-orange-600 to-red-600"}`}>
                                        <GitCompare className="w-5 h-5 text-white" />
                                    </div>
                                    <CardTitle>{label}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <Label>Issuer</Label>
                                    <Input name={`${prefix}_issuer`} placeholder="e.g. Stanford University" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Recipient</Label>
                                    <Input name={`${prefix}_recipient`} placeholder="e.g. Jane Smith" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Course</Label>
                                    <Input name={`${prefix}_course`} placeholder="e.g. Data Science" required />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-6">
                    <Button type="submit" className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 h-11" disabled={loading}>
                        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Comparing...</> : <><GitCompare className="w-4 h-4 mr-2" /> Compare Certificates</>}
                    </Button>
                </div>
            </form>

            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6 flex items-center gap-3"><XCircle className="w-5 h-5 text-red-500" /><p className="text-red-700">{error}</p></CardContent>
                </Card>
            )}

            {result && (
                <Card className={`border-2 shadow-lg ${result.is_duplicate ? "border-red-200" : "border-emerald-200"}`}>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${result.is_duplicate ? "bg-red-100" : "bg-emerald-100"}`}>
                                {result.is_duplicate ? <AlertTriangle className="w-10 h-10 text-red-600" /> : <CheckCircle className="w-10 h-10 text-emerald-600" />}
                            </div>
                            <h3 className="text-2xl font-bold">{result.is_duplicate ? "Duplicate Detected!" : "Certificates Are Unique"}</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Similarity Score</span>
                                    <span className="font-semibold">{(result.similarity_score * 100).toFixed(1)}%</span>
                                </div>
                                <Progress value={result.similarity_score * 100} className="h-3" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

// ─── Chat Tab ──────────────────────────────────────────────────
function ChatTab() {
    const [messages, setMessages] = useState<Array<{ role: "user" | "bot"; text: string; confidence?: number }>>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSend = async () => {
        if (!input.trim() || loading) return
        const userMsg = input.trim()
        setInput("")
        setMessages(prev => [...prev, { role: "user", text: userMsg }])
        setLoading(true)

        try {
            const data = await mlApi.chat({ message: userMsg })
            setMessages(prev => [...prev, { role: "bot", text: data.response, confidence: data.confidence }])
        } catch {
            setMessages(prev => [...prev, { role: "bot", text: "Sorry, I couldn't process your request. The ML service might be unavailable." }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <CardTitle>AI Certificate Assistant</CardTitle>
                        <CardDescription>Ask anything about certificate verification, fraud detection, or SmartCertify</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Messages */}
                <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-xl">
                    {messages.length === 0 && (
                        <div className="text-center py-16 text-gray-400">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">Start a conversation</p>
                            <p className="text-sm mt-1">Try: "How does fraud detection work?"</p>
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user"
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                    : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                                }`}>
                                <p className="text-sm">{msg.text}</p>
                                {msg.confidence !== undefined && (
                                    <p className="text-xs mt-1 opacity-60">Confidence: {(msg.confidence * 100).toFixed(0)}%</p>
                                )}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSend()}
                        placeholder="Ask about certificates, verification, fraud..."
                        className="flex-1 h-11"
                    />
                    <Button onClick={handleSend} disabled={loading || !input.trim()} className="h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6">
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

// ─── Main Page ─────────────────────────────────────────────────
export default function AIVerifyPage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 flex">
                <DashboardSidebar />

                <div className="flex-1 flex flex-col min-w-0">
                    <DashboardHeader
                        title="AI Verification Center"
                        description="Powered by SmartCertify ML — fraud detection, image analysis, similarity checking, and AI chat"
                    />

                    <main className="flex-1 p-6 overflow-auto">
                        {/* ML Status Banner */}
                        <div className="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                        <Brain className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold">SmartCertify AI Engine</h2>
                                        <p className="text-sm text-white/80">4 ML models • Ensemble voting • Real-time analysis</p>
                                    </div>
                                </div>
                                <Badge className="bg-white/20 text-white border-0 backdrop-blur">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                                    Online
                                </Badge>
                            </div>
                        </div>

                        {/* Tabs */}
                        <Tabs defaultValue="fraud" className="space-y-6">
                            <TabsList className="bg-white border shadow-sm p-1 h-auto flex-wrap">
                                <TabsTrigger value="fraud" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 gap-2 px-4 py-2.5">
                                    <Shield className="w-4 h-4" /> Fraud Detection
                                </TabsTrigger>
                                <TabsTrigger value="image" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 gap-2 px-4 py-2.5">
                                    <ImageIcon className="w-4 h-4" /> Image Analysis
                                </TabsTrigger>
                                <TabsTrigger value="similarity" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 gap-2 px-4 py-2.5">
                                    <GitCompare className="w-4 h-4" /> Similarity Check
                                </TabsTrigger>
                                <TabsTrigger value="chat" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 gap-2 px-4 py-2.5">
                                    <MessageSquare className="w-4 h-4" /> AI Chat
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="fraud"><FraudDetectionTab /></TabsContent>
                            <TabsContent value="image"><ImageAnalysisTab /></TabsContent>
                            <TabsContent value="similarity"><SimilarityTab /></TabsContent>
                            <TabsContent value="chat"><ChatTab /></TabsContent>
                        </Tabs>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}
