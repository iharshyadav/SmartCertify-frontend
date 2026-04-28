"use client"

import Link from "next/link"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { StatsCards } from "@/components/dashboard/StatsCards"
import RecentActivity from "@/components/dashboard/RecentActivity"
import UploadCertificateModal from "@/components/dashboard/UploadCertificateModal"
import { useEffect, useState } from "react"
import { certificateApi, DashboardStats, Certificate } from "@/lib/certificate-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  Shield,
  Award,
  ArrowRight,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  Cpu,
  Link2,
} from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      const [statsRes, certsRes] = await Promise.all([
        certificateApi.getDashboardStats(),
        certificateApi.getCertificates()
      ])
      if (statsRes.success) setStats(statsRes.data)
      if (certsRes.success) setCertificates(certsRes.data)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader
            title="Dashboard"
            description="Welcome back! Here's what's happening with your certificates."
          />
          <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-auto">

            {/* Stats Cards + Charts */}
            {loading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200/80 animate-pulse" />
                  ))}
                </div>
              </div>
            ) : (
              <StatsCards statsData={stats} />
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UploadCertificateModal onSuccess={fetchDashboardData}>
                <Button className="h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-full shadow-md hover:shadow-blue-200 text-sm font-semibold transition-all duration-200 active:scale-[0.99]">
                  <Upload className="w-4 h-4 mr-2.5" />
                  Upload Certificate
                </Button>
              </UploadCertificateModal>
              <Link href="/dashboard/ai-verify" className="w-full">
                <Button variant="outline" className="h-14 rounded-xl w-full border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-300 shadow-sm text-sm font-semibold transition-all duration-200 active:scale-[0.99] text-slate-700">
                  <Shield className="w-4 h-4 mr-2.5 text-indigo-500" />
                  AI Verify Certificate
                </Button>
              </Link>
            </div>

            {/* Main Content: Activity + Side Panel */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Recent Activity — 2 col span */}
              <div className="xl:col-span-2">
                <RecentActivity />
              </div>

              {/* Side Panel */}
              <div className="space-y-4">
                {/* Summary */}
                <Card className="border border-slate-200/80 shadow-sm bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-800">Today's Summary</CardTitle>
                    <CardDescription className="text-xs text-slate-400">Key metrics for today</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Processed</span>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs font-semibold">{stats?.totalCertificates || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Success Rate</span>
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-50">{stats?.successRate || 0}%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Pending</span>
                      <Badge variant="outline" className="border-amber-200 text-amber-700 text-xs font-semibold">{stats?.pendingReviews || 0}</Badge>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-500">Certificates Stored</span>
                        <span className="text-xs font-semibold text-slate-700">{stats?.totalCertificates || 0} / ∞</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(100, ((stats?.totalCertificates || 0) / 100) * 100)}%` }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Certificates */}
                <Card className="border border-slate-200/80 shadow-sm bg-white">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold text-slate-800">Recent Certificates</CardTitle>
                      <CardDescription className="text-xs text-slate-400">Latest uploads</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-slate-100">
                      <Plus className="w-4 h-4 text-slate-400" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    {certificates.length === 0 ? (
                      <div className="text-xs text-slate-400 text-center py-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        No certificates yet
                      </div>
                    ) : (
                      certificates.slice(0, 4).map((cert) => (
                        <div key={cert.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors duration-150 border border-transparent hover:border-slate-200">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-100">
                            <Award className="w-4 h-4 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-700 truncate">{cert.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">#{cert.id.substring(0, 8)}</p>
                          </div>
                          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-[10px] font-semibold border flex-shrink-0">
                            <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                            Done
                          </Badge>
                        </div>
                      ))
                    )}
                    <Link href="/dashboard/history">
                      <Button variant="ghost" className="w-full text-xs h-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 mt-1">
                        View All History
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* System Status */}
                <Card className="border border-slate-200/80 shadow-sm bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-800">System Status</CardTitle>
                    <CardDescription className="text-xs text-slate-400">All systems operational</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "AI Processing", status: "Online", icon: Cpu, color: "text-emerald-600", dot: "bg-emerald-500", bg: "bg-emerald-50" },
                      { label: "Blockchain Network", status: "Connected", icon: Link2, color: "text-emerald-600", dot: "bg-emerald-500", bg: "bg-emerald-50" },
                      { label: "Queue Processing", status: "75% Used", icon: Clock, color: "text-amber-600", dot: "bg-amber-500", bg: "bg-amber-50" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center ${item.bg}`}>
                            <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                          </div>
                          <span className="text-xs text-slate-600">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${item.dot} ${item.dot === "bg-emerald-500" ? "animate-pulse" : ""}`} />
                          <span className={`text-xs font-semibold ${item.color}`}>{item.status}</span>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-100">
                      <Button variant="outline" className="w-full text-xs h-8 border-slate-200 text-slate-600 hover:bg-slate-50">
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Export Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
