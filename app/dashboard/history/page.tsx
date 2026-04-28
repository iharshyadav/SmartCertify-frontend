"use client"

import { useState, useEffect, useCallback } from "react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  FileText, Search, Download, Trash2, Calendar, Eye, AlertTriangle,
  CheckCircle2, Loader2, ImageOff, X, Clock,
} from "lucide-react"
import { certificateApi, Certificate } from "@/lib/certificate-api"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

function formatDate(d: string) {
  try { return format(new Date(d), "dd MMM yyyy") } catch { return d }
}

function CertCard({ cert, onDelete }: { cert: Certificate; onDelete: (id: string) => void }) {
  const [imgError, setImgError] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try { await certificateApi.deleteCertificate(cert.id); onDelete(cert.id) } catch { setDeleting(false) }
  }

  return (
    <Card className="group border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-36 bg-slate-100 overflow-hidden border-b border-slate-200">
        {!imgError && cert.imageUrl ? (
          <img
            src={cert.imageUrl} alt={cert.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-8 h-8 text-slate-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1.5">
          {cert.imageUrl && (
            <a href={cert.imageUrl} target="_blank" rel="noopener noreferrer"
              className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center shadow-sm hover:bg-white">
              <Eye className="w-3.5 h-3.5 text-slate-700" />
            </a>
          )}
          <button onClick={() => setShowConfirm(true)}
            className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center shadow-sm hover:bg-red-50">
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-slate-800 truncate mb-2" title={cert.name}>{cert.name}</h3>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Issued: {formatDate(cert.issueDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Added: {formatDate(cert.createdAt)}</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold">
            <CheckCircle2 className="w-3 h-3 mr-1" />Stored
          </Badge>
          {cert.imageUrl && (
            <a href={cert.imageUrl} download className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 transition-colors">
              <Download className="w-3 h-3" />View
            </a>
          )}
        </div>
      </CardContent>

      {/* Delete confirmation overlay */}
      {showConfirm && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 rounded-xl z-10">
          <AlertTriangle className="w-7 h-7 text-amber-500 mb-2" />
          <p className="text-sm font-semibold text-slate-800 mb-1 text-center">Delete this certificate?</p>
          <p className="text-xs text-slate-500 mb-4 text-center">This action cannot be undone.</p>
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={() => setShowConfirm(false)}>
              <X className="w-3 h-3 mr-1" />Cancel
            </Button>
            <Button size="sm" disabled={deleting} onClick={handleDelete}
              className="flex-1 text-xs h-8 bg-red-600 hover:bg-red-700 text-white">
              {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Trash2 className="w-3 h-3 mr-1" />Delete</>}
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

export default function CertificateHistoryPage() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [filtered, setFiltered] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const loadAll = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await certificateApi.getAllCertificates()
      if (res.success) { setCerts(res.data); setFiltered(res.data) }
    } catch (e: any) {
      setError(e.message || "Failed to load certificates")
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  useEffect(() => {
    const q = search.toLowerCase().trim()
    setFiltered(q ? certs.filter(c => c.name.toLowerCase().includes(q)) : certs)
  }, [search, certs])

  const handleDelete = (id: string) => {
    setCerts(prev => prev.filter(c => c.id !== id))
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader title="Certificate History" description="All your uploaded certificates — view, search, and manage them." />
          <main className="flex-1 p-6 lg:p-8 overflow-auto">

            {/* Top bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">All Certificates</h2>
                  <p className="text-xs text-slate-500">{certs.length} certificate{certs.length !== 1 ? "s" : ""} total</p>
                </div>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name..." className="h-10 pl-9 border-slate-200 bg-white text-sm" />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* States */}
            {loading && (
              <div className="flex items-center justify-center min-h-[320px]">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Loading your certificates...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center min-h-[320px]">
                <div className="text-center">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700 mb-1">Failed to load certificates</p>
                  <p className="text-xs text-slate-500 mb-4">{error}</p>
                  <Button variant="outline" size="sm" onClick={loadAll}>Try Again</Button>
                </div>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[320px] border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-600 mb-1">
                  {search ? "No results found" : "No certificates yet"}
                </h3>
                <p className="text-sm text-slate-400 text-center max-w-xs">
                  {search ? `No certificates match "${search}"` : "Upload a certificate from the dashboard to get started"}
                </p>
                {search && <Button variant="outline" size="sm" className="mt-4" onClick={() => setSearch("")}>Clear search</Button>}
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map(cert => (
                  <div key={cert.id} className="relative">
                    <CertCard cert={cert} onDelete={handleDelete} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
