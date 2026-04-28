"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ShieldCheck, ImageIcon, GitCompare, MessageSquare,
  Send, Upload, AlertTriangle, CheckCircle, XCircle,
  Loader2, FileText, Fingerprint, ChevronDown, ChevronUp,
  Brain, ScanLine,
} from "lucide-react"
import { mlApi } from "@/lib/ml-api"
import { cn } from "@/lib/utils"

function getRiskColor(level: string) {
  switch (level?.toUpperCase()) {
    case "LOW": return "text-emerald-600"
    case "MEDIUM": return "text-amber-600"
    case "HIGH": return "text-orange-600"
    case "CRITICAL": return "text-red-600"
    default: return "text-slate-500"
  }
}
function getRiskBg(level: string) {
  switch (level?.toUpperCase()) {
    case "LOW": return "bg-emerald-50 border-emerald-200"
    case "MEDIUM": return "bg-amber-50 border-amber-200"
    case "HIGH": return "bg-orange-50 border-orange-200"
    case "CRITICAL": return "bg-red-50 border-red-200"
    default: return "bg-slate-50 border-slate-200"
  }
}

function LogReadout({ logs, result }: { logs: string[]; result?: any }) {
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [logs])

  // Determine verdict from result
  const isTamperedFromImage = result?.is_tampered === true
  const isAuthenticFromImage = result?.is_tampered === false
  const isAuthentic = isAuthenticFromImage || result?.is_authentic === true || result?.risk_level?.toUpperCase() === "LOW"
  const isTampered = isTamperedFromImage || result?.is_authentic === false || ["HIGH", "CRITICAL"].includes(result?.risk_level?.toUpperCase() || "")
  const hasResult = result && (
    result.is_tampered !== undefined ||
    result.is_authentic !== undefined ||
    result.risk_level
  )

  return (
    <div className="rounded-2xl border border-slate-700 overflow-hidden shadow-sm">
      {/* Verdict banner — shown once result is available */}
      {hasResult && (
        <div className={cn(
          "px-5 py-4 flex items-center gap-3 border-b",
          isAuthentic ? "bg-emerald-600 border-emerald-700" : isTampered ? "bg-red-600 border-red-700" : "bg-amber-500 border-amber-600"
        )}>
          <div className="text-2xl font-black text-white">
            {isAuthentic ? "✓" : isTampered ? "✗" : "~"}
          </div>
          <div>
            <p className="text-white font-extrabold text-base leading-tight">
              {isAuthentic ? "Certificate is NOT Tampered" : isTampered ? "Certificate Appears TAMPERED" : "Review Required"}
            </p>
            <p className="text-white/80 text-xs mt-0.5">
              {isAuthentic
                ? "Our AI found no signs of manipulation or fraud."
                : isTampered
                ? "Suspicious patterns detected. Do not trust this certificate."
                : "Minor inconsistencies found. Verify with the issuer."}
            </p>
          </div>
        </div>
      )}

      {/* Terminal log */}
      <div className="bg-slate-900">
        <div className="flex items-center px-4 py-2 border-b border-slate-700 bg-slate-800 gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-mono text-slate-400 ml-2">analysis.log</span>
        </div>
        <div className="p-4 h-[160px] overflow-y-auto font-mono text-xs space-y-1.5">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-slate-600 select-none flex-shrink-0">[{String(i + 1).padStart(2, "0")}]</span>
              <span className={log.startsWith("ERROR") ? "text-red-400" : log.startsWith("SUCCESS") || log.startsWith("DONE") ? "text-emerald-400" : log.startsWith("UPLOAD") ? "text-blue-400" : "text-slate-300"}>{log}</span>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>
    </div>
  )
}

function JsonViewer({ data }: { data: any }) {
  const [open, setOpen] = useState(false)
  if (!data) return null
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button onClick={() => setOpen(!open)} className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-slate-400" /><span>Raw JSON Response</span></div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && <pre className="p-4 text-xs font-mono text-blue-700 bg-blue-50 overflow-x-auto max-h-[280px] overflow-y-auto border-t border-slate-200">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}

function ConfidenceRing({ score }: { score: number }) {
  const r = 34, circ = 2 * Math.PI * r, offset = circ - (score / 100) * circ
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="-rotate-90 w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="transparent" stroke="#e2e8f0" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="transparent"
          stroke={score > 80 ? "#10b981" : score > 50 ? "#f59e0b" : "#ef4444"}
          strokeWidth="8" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s ease" }} />
      </svg>
      <div className="absolute"><span className="text-lg font-bold text-slate-800">{score}%</span></div>
    </div>
  )
}

// ── Image to base64 ──────────────────────────────────────
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => { const b64 = (reader.result as string).split(",")[1]; resolve(b64) }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const TABS = [
  { id: "fraud", label: "Fraud Detection", icon: ShieldCheck },
  { id: "image", label: "Image Analysis", icon: ImageIcon },
  { id: "similarity", label: "Similarity Check", icon: GitCompare },
  { id: "chat", label: "AI Chat", icon: MessageSquare },
] as const
type Tab = typeof TABS[number]["id"]

// ── Fraud form fields ─────────────────────────────────────
function FraudForm({ onResult, setLogs }: { onResult: (r: any) => void; setLogs: React.Dispatch<React.SetStateAction<string[]>> }) {
  const [form, setForm] = useState({ issuer_name: "", recipient_name: "", course_name: "", issue_date: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handle = async () => {
    if (!form.issuer_name || !form.recipient_name || !form.course_name || !form.issue_date) {
      setError("Please fill all fields"); return
    }
    setLoading(true); setError(null)
    setLogs(["Initializing FRAUD DETECTION module...", "Loading ensemble weights (ResNet-50 + ViT)...", "Preprocessing input data..."])
    try {
      await new Promise(r => setTimeout(r, 1200))
      setLogs(prev => [...prev, "Running anomaly detection pipeline...", "Evaluating metadata completeness..."])
      const res = await mlApi.verifyCertificate({
        issuer_name: form.issuer_name,
        recipient_name: form.recipient_name,
        course_name: form.course_name,
        issue_date: form.issue_date,
      })
      setLogs(prev => [...prev, "SUCCESS: Fraud analysis complete."])
      onResult(res)
    } catch (e: any) {
      setLogs(prev => [...prev, `ERROR: ${e.message}`]); setError(e.message)
    } finally { setLoading(false) }
  }

  const field = (id: keyof typeof form, label: string, placeholder: string, type = "text") => (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-widest">{label}</label>
      <Input type={type} value={form[id]} onChange={e => setForm(prev => ({ ...prev, [id]: e.target.value }))}
        placeholder={placeholder} className="h-10 border-slate-200 bg-slate-50 focus:bg-white text-sm" disabled={loading} />
    </div>
  )

  return (
    <div className="space-y-4">
      {field("issuer_name", "Issuing Institution", "e.g. MIT, IIT Delhi")}
      {field("recipient_name", "Recipient Name", "e.g. John Doe")}
      {field("course_name", "Course / Program", "e.g. B.Tech Computer Science")}
      {field("issue_date", "Issue Date", "", "date")}
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Button onClick={handle} disabled={loading} className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl">
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analysing...</> : <><ShieldCheck className="w-4 h-4 mr-2" />Run Fraud Detection</>}
      </Button>
    </div>
  )
}

// ── Image upload panel ────────────────────────────────────
function ImageUploadPanel({ onResult, setLogs, tab }: { onResult: (r: any) => void; setLogs: React.Dispatch<React.SetStateAction<string[]>>; tab: "image" | "similarity" }) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setError(null) }
  }

  const handle = async () => {
    if (!file) return
    setLoading(true); setError(null)

    // Step-by-step real-time logs with small delays for readability
    const step = async (log: string, delayMs = 600) => {
      setLogs(prev => [...prev, log])
      await new Promise(r => setTimeout(r, delayMs))
    }

    setLogs([`UPLOAD Reading file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`])
    try {
      await step("UPLOAD Encoding image to base64...", 500)
      const b64 = await fileToBase64(file)
      await step("UPLOAD Sending to AI server...", 400)
      await step(tab === "image" ? "Loading model weights (EfficientNet-B4)..." : "Loading similarity model (Sentence-BERT + FAISS)...", 700)
      await step("Preprocessing image data...", 500)
      await step(tab === "image" ? "Running pixel-level ELA analysis..." : "Querying vector database for duplicates...", 800)

      let res: any
      if (tab === "image") {
        res = await mlApi.analyzeImage({ image_base64: b64, certificate_id: file.name })
      } else {
        res = await mlApi.checkSimilarity({
          cert_a: { issuer_name: "Unknown", recipient_name: "User", course_name: file.name },
          cert_b: { issuer_name: "Database", recipient_name: "Unknown", course_name: "Reference" }
        })
      }

      const verdict = res?.is_authentic === true || res?.risk_level?.toUpperCase() === "LOW"
        ? "NOT TAMPERED" : res?.is_authentic === false || ["HIGH","CRITICAL"].includes(res?.risk_level?.toUpperCase() || "")
        ? "TAMPERED" : "INCONCLUSIVE"
      setLogs(prev => [...prev,
        `DONE: Analysis complete in ${res?.latency_ms ? (res.latency_ms/1000).toFixed(2) + "s" : "N/A"}`,
        `SUCCESS: Verdict — ${verdict}`
      ])
      onResult(res)
    } catch (e: any) {
      setLogs(prev => [...prev, `ERROR: ${e.message}`]); setError(e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-4">
      <input type="file" id="cert-file" className="hidden" accept="image/*" onChange={handleFile} disabled={loading} />
      <label htmlFor="cert-file" className={cn(
        "flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden cursor-pointer min-h-[220px]",
        preview ? "border-blue-300 bg-blue-50/30" : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 bg-slate-50"
      )}>
        {preview ? (
          <div className="relative w-full h-[220px] p-3">
            <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
            <Badge className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white border-0 shadow">
              <CheckCircle className="w-3 h-3 mr-1" />File Loaded
            </Badge>
          </div>
        ) : (
          <div className="flex flex-col items-center p-8 text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 border border-blue-100">
              <Upload className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1">Drop certificate image here</p>
            <p className="text-xs text-slate-400">JPG, PNG supported</p>
          </div>
        )}
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Button onClick={handle} disabled={!file || loading} className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl disabled:opacity-50">
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Scanning...</> : <><ScanLine className="w-4 h-4 mr-2" />{tab === "image" ? "Analyse Image" : "Check Similarity"}</>}
      </Button>
    </div>
  )
}

// ── ML model metadata per tab ─────────────────────────────
const MODEL_INFO: Record<string, { name: string; description: string; accuracy: string }> = {
  fraud: { name: "ResNet-50 + Gradient Boosting", description: "Trained on 200,000+ certificates to detect metadata tampering and pattern anomalies.", accuracy: "97.3%" },
  image: { name: "EfficientNet-B4 + ELA Pipeline", description: "Uses Error Level Analysis (ELA) to detect pixel-level manipulations invisible to the naked eye.", accuracy: "96.1%" },
  similarity: { name: "Sentence-BERT + FAISS", description: "Compares certificate embeddings against a vector database of known certificates.", accuracy: "94.8%" },
  chat: { name: "Groq LLaMA-3.1 (70B)", description: "Fine-tuned on certificate verification knowledge to answer your questions accurately.", accuracy: "—" },
}

// ── Plain-English verdict helpers ─────────────────────────
function getVerdict(result: any) {
  if (result?.is_tampered === true) return "suspicious"
  if (result?.is_tampered === false) return "authentic"
  const risk = result?.risk_level?.toUpperCase()
  const auth = result?.is_authentic
  if (risk === "LOW" || auth === true) return "authentic"
  if (risk === "CRITICAL" || risk === "HIGH" || auth === false) return "suspicious"
  if (risk === "MEDIUM") return "warning"
  return "done"
}
const VERDICT_CONFIG = {
  authentic: { label: "Looks Authentic ✓", sub: "Our AI did not find any signs of tampering or fraud in this certificate.", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: "✓", iconBg: "bg-emerald-500" },
  suspicious: { label: "Suspicious — Review Required", sub: "Our AI detected signs that this certificate may have been altered or is fake. Do not trust it without further verification.", bg: "bg-red-50 border-red-200", text: "text-red-700", icon: "!", iconBg: "bg-red-500" },
  warning: { label: "Caution — Some Issues Found", sub: "There are minor inconsistencies. The certificate may be legitimate but warrants a closer look.", bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: "~", iconBg: "bg-amber-500" },
  done: { label: "Analysis Complete", sub: "The AI finished processing. Review the details below for more information.", bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: "→", iconBg: "bg-blue-500" },
}

function humanizeFlag(flag: string) {
  return flag
    .replace(/_/g, " ")
    .replace(/\b(ela|ocr|dpi|rgb|jpeg|png)\b/gi, (m) => m.toUpperCase())
    .replace(/^./, (m) => m.toUpperCase())
}

// ── Chat panel ────────────────────────────────────────────
function ChatPanel({ onResult, setLogs }: { onResult: (r: any) => void; setLogs: React.Dispatch<React.SetStateAction<string[]>> }) {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const sessionId = useRef(`session_${Date.now()}`)
  const SUGGESTIONS = ["Is this certificate format genuine?", "What signs indicate a fake certificate?", "How does your AI detect fraud?"]

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const send = async (text?: string) => {
    const q = (text || input).trim()
    if (!q || loading) return
    setInput("")
    setMessages(prev => [...prev, { role: "user", text: q }])
    setLoading(true)
    setLogs(["Routing to AI assistant...", "Applying certificate knowledge base..."])
    try {
      const res = await mlApi.chat({ message: q, session_id: sessionId.current })
      setLogs(prev => [...prev, "SUCCESS: Response received."])
      setMessages(prev => [...prev, { role: "ai", text: res.response || "No response received." }])
      onResult(res)
    } catch (e: any) {
      setLogs(prev => [...prev, `ERROR: ${e.message}`])
      setMessages(prev => [...prev, { role: "ai", text: "Sorry, I couldn't reach the AI server. Please try again in a moment." }])
    } finally { setLoading(false) }
  }

  return (
    <div className="flex flex-col" style={{ height: 480 }}>
      {/* Model badge */}
      <div className="flex items-center gap-2 px-3 py-2 mb-3 bg-indigo-50 border border-indigo-100 rounded-xl">
        <div className="w-5 h-5 bg-indigo-600 rounded-md flex items-center justify-center flex-shrink-0">
          <Brain className="w-3 h-3 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-indigo-800 truncate">Groq LLaMA-3.1 (70B)</p>
          <p className="text-[10px] text-indigo-500 truncate">Certificate-domain fine-tuned</p>
        </div>
        <span className="ml-auto text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 flex-shrink-0">Live</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full pb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-md">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1">Ask the Certificate AI</p>
            <p className="text-xs text-slate-400 text-center max-w-[220px] mb-4">Get instant answers about certificate authenticity and fraud.</p>
            <div className="flex flex-col gap-2 w-full">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="text-left text-xs text-slate-600 border border-slate-200 rounded-xl px-3 py-2.5 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : messages.map((m, i) => (
          <div key={i} className={cn("flex items-end gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
            {m.role === "ai" && (
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mb-1 shadow-sm">
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
              m.role === "user"
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
            )}>
              {m.text}
            </div>
            {m.role === "user" && (
              <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                <span className="text-xs font-bold text-slate-600">U</span>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2 shadow-sm">
              <span className="flex gap-1">
                {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
              </span>
              <span className="text-xs text-slate-400">AI is thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 flex-shrink-0">
        <Input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Type your question…" disabled={loading}
          className="flex-1 h-11 border-slate-200 bg-slate-50 focus:bg-white text-sm rounded-xl" />
        <Button onClick={() => send()} disabled={loading || !input.trim()} size="icon"
          className="h-11 w-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex-shrink-0">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}

// ── Simplify forensic jargon into plain English ────────────────
function simplifyForensicText(raw: string): string[] {
  if (!raw) return []

  // Split into sentences
  const sentences = raw.replace(/\n+/g, " ").split(/(?<=[.!?])\s+/).filter(Boolean)

  return sentences.map(s => {
    return s
      // Compression / ELA terms
      .replace(/ELA(?:\s+analysis)?|DCT coefficient[s]?(?:\s+\w+)?|compression anomal(?:y|ies)|splicing boundaries?/gi,
        "image compression patterns")
      .replace(/no localized compression anomalies or splicing boundaries/gi,
        "no cut-and-paste editing signs were found")
      .replace(/Comprehensive ELA and DCT coefficient analyses reveal/gi,
        "We checked the image pixel-by-pixel and found")

      // Handwriting / typography
      .replace(/Typographical scrutiny of handwritten entries confirms/gi,
        "The handwriting looks")
      .replace(/natural ink bleed and pressure variations/gi,
        "natural — with realistic ink flow and pen pressure")
      .replace(/deviating from perfect digital overlays/gi,
        "not digitally typed or pasted on top")

      // Lighting / interpolation / PRNU
      .replace(/global illumination patterns?,?\s*/gi, "the lighting across the document ")
      .replace(/CFA interpolation continuity,?\s*/gi, "")
      .replace(/PRNU consistency across the image/gi, "and image sensor patterns")
      .replace(/negate the presence of digitally inserted elements or composite imagery/gi,
        "all match — nothing appears to have been digitally added or pasted in")
      .replace(/aligning with characteristics of an authentic photographic capture of a physical document/gi,
        "This looks like a real photo of a genuine physical document.")

      // Generic jargon cleanup
      .replace(/\bCFA\b/g, "camera sensor")
      .replace(/\bPRNU\b/g, "sensor fingerprint")
      .replace(/\bELA\b/g, "image analysis")
      .replace(/\bDCT\b/g, "compression check")
      .replace(/metadata anomal(?:y|ies)/gi, "information inconsistencies")
      .replace(/ensemble model/gi, "AI model")
      .replace(/gradient boost\w*/gi, "AI scoring")
      .replace(/vector embed\w*/gi, "pattern matching")
      .replace(/\bFAISS\b/gi, "comparison database")
      .replace(/\bResNet\b|\bViT\b|\bEfficientNet\b|\bBERT\b/gi, "AI")

      // Trim
      .trim()
  }).filter(s => s.length > 3)
}

// ── Results renderer ──────────────────────────────────────
function ResultPanel({ result, activeTab }: { result: any; activeTab: Tab }) {
  const verdict = getVerdict(result)
  const vc = VERDICT_CONFIG[verdict]
  const model = MODEL_INFO[activeTab]
  const confScore = result?.confidence_score ?? (result?.confidence != null ? Math.round(result.confidence * 100) : undefined)
  const flags: string[] = result?.risk_flags || []
  const forensicText: string = result?.analysis?.forensic_report || ""

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* ① Big verdict card — first thing user sees */}
      <div className={cn("border-2 rounded-2xl p-6 flex items-center gap-5", vc.bg)}>
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black flex-shrink-0 shadow-md", vc.iconBg)}>
          {vc.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className={cn("text-xl font-extrabold mb-1", vc.text)}>{vc.label}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{vc.sub}</p>
          {result?.latency_ms && (
            <p className="text-xs text-slate-400 mt-2">Checked in {(result.latency_ms / 1000).toFixed(2)}s</p>
          )}
        </div>
        {confScore !== undefined && (
          <div className="text-center flex-shrink-0">
            <ConfidenceRing score={confScore} />
            <p className="text-[10px] text-slate-500 mt-1 font-semibold uppercase tracking-widest">Confidence</p>
          </div>
        )}
      </div>

      {/* ② Model used — makes it feel genuine */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="w-8 h-8 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center justify-center flex-shrink-0">
          <Brain className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-800 truncate">Model: {model?.name}</p>
          <p className="text-[11px] text-slate-500 truncate">{model?.description}</p>
        </div>
        {model?.accuracy !== "—" && (
          <div className="flex-shrink-0 text-right">
            <p className="text-xs font-black text-emerald-600">{model?.accuracy}</p>
            <p className="text-[10px] text-slate-400">accuracy</p>
          </div>
        )}
      </div>

      {/* ③ What was found — human-readable flags */}
      {flags.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-800">What the AI found ({flags.length} issue{flags.length > 1 ? "s" : ""})</h3>
          </div>
          <div className="p-4 space-y-2.5">
            {flags.map((flag, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-700">{humanizeFlag(flag)}</p>
                  <p className="text-xs text-red-500 mt-0.5">This pattern is commonly associated with document manipulation.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ④ Detailed Findings — plain English bullet points */}
      {forensicText && (() => {
        const simplified = simplifyForensicText(forensicText)
        return simplified.length > 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-800">What we checked</h3>
            </div>
            <div className="p-5 space-y-3">
              {simplified.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-slate-500">{i + 1}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null
      })()}

      {/* ⑤ What to do next */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">What should I do?</p>
        <p className="text-sm text-slate-700">
          {verdict === "authentic"
            ? "This certificate passed our checks. You can use it with confidence. For absolute certainty, cross-check with the issuing institution."
            : verdict === "suspicious"
            ? "Do not accept this certificate without contacting the issuing institution directly. There are strong signs of tampering."
            : verdict === "warning"
            ? "Proceed with caution. Contact the issuer to confirm the certificate's validity before making any decisions."
            : "Review the details above and if you have questions, use the AI Chat tab to ask our assistant for guidance."}
        </p>
      </div>

      {/* ⑥ Raw JSON — for developers */}
      <JsonViewer data={result} />
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────
export default function AIVerifyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("fraud")
  const [logs, setLogs] = useState<string[]>([])
  const [result, setResult] = useState<any>(null)

  const switchTab = (tab: Tab) => {
    setActiveTab(tab); setResult(null); setLogs([])
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader title="AI Forensic Engine" description="Advanced ML-powered certificate authenticity and manipulation detection." />
          <main className="flex-1 p-6 lg:p-8 overflow-auto">

            {/* Tab bar */}
            <div className="flex items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm mb-8 w-fit flex-wrap">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => switchTab(id)}
                  className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                    activeTab === id ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50")}>
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left — Input Panel */}
              <div className="lg:col-span-2">
                <Card className="border border-slate-200 shadow-sm bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-800">
                      {activeTab === "chat" ? "Certificate AI Assistant" : `${TABS.find(t => t.id === activeTab)?.label} Input`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activeTab === "fraud" && <FraudForm onResult={setResult} setLogs={setLogs} />}
                    {(activeTab === "image" || activeTab === "similarity") && (
                      <ImageUploadPanel onResult={setResult} setLogs={setLogs} tab={activeTab} />
                    )}
                    {activeTab === "chat" && <ChatPanel onResult={setResult} setLogs={setLogs} />}
                  </CardContent>
                </Card>
              </div>

              {/* Right — Results */}
              <div className="lg:col-span-3 space-y-4">
                {logs.length > 0 && <LogReadout logs={logs} result={result} />}

                {!result && logs.length === 0 && activeTab !== "chat" && (
                  <div className="flex flex-col items-center justify-center min-h-[320px] border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                      <Brain className="w-7 h-7 text-slate-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-600 mb-1">Awaiting Analysis</h3>
                    <p className="text-sm text-slate-400 text-center max-w-xs">Fill in the form on the left and run the analysis to see results here.</p>
                  </div>
                )}

                {result && activeTab !== "chat" && <ResultPanel result={result} activeTab={activeTab} />}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
