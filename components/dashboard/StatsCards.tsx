"use client"

import { TrendingUp, TrendingDown, Award, Users, Shield, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

interface StatsData {
  totalCertificates?: string | number
  activeStudents?: string | number
  verifiedToday?: string | number
  successRate?: number
  pendingReviews?: string | number
  failedVerifications?: string | number
}

interface StatsCardsProps {
  statsData?: StatsData | null
}

// --- Mock Chart Data ---
const monthlyData = [
  { month: "Jan", certificates: 65, verified: 58, failed: 7 },
  { month: "Feb", certificates: 78, verified: 72, failed: 6 },
  { month: "Mar", certificates: 90, verified: 85, failed: 5 },
  { month: "Apr", certificates: 81, verified: 77, failed: 4 },
  { month: "May", certificates: 110, verified: 105, failed: 5 },
  { month: "Jun", certificates: 125, verified: 120, failed: 5 },
  { month: "Jul", certificates: 142, verified: 136, failed: 6 },
]

const weeklySuccessData = [
  { day: "Mon", rate: 94 },
  { day: "Tue", rate: 97 },
  { day: "Wed", rate: 92 },
  { day: "Thu", rate: 98 },
  { day: "Fri", rate: 96 },
  { day: "Sat", rate: 99 },
  { day: "Sun", rate: 95 },
]

const fraudBreakdown = [
  { name: "Legitimate", value: 87, color: "#3b82f6" },
  { name: "Suspicious", value: 8, color: "#f59e0b" },
  { name: "Fraudulent", value: 5, color: "#ef4444" },
]

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value}{p.name === "rate" ? "%" : ""}
          </p>
        ))}
      </div>
    )
  }
  return null
}

interface StatCardProps {
  title: string
  value: string | number
  change?: { value: string; type: "increase" | "decrease"; period: string }
  icon: React.ElementType
  iconColor: string
  iconBg: string
  accent: string
}

function StatCard({ title, value, change, icon: Icon, iconColor, iconBg, accent }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 bg-white group cursor-default">
      <div className={cn("absolute top-0 left-0 right-0 h-0.5", accent)} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">{title}</p>
            <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
            {change && (
              <div className="flex items-center gap-1.5 mt-2">
                {change.type === "increase"
                  ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  : <TrendingDown className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                }
                <span className={cn("text-xs font-bold", change.type === "increase" ? "text-emerald-600" : "text-red-600")}>
                  {change.value}
                </span>
                <span className="text-xs text-slate-400">{change.period}</span>
              </div>
            )}
          </div>
          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110", iconBg)}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCards({ statsData }: StatsCardsProps) {
  const stats: StatCardProps[] = [
    {
      title: "Total Certificates",
      value: statsData?.totalCertificates || "0",
      change: { value: "+12.5%", type: "increase", period: "from last month" },
      icon: Award,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      accent: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: "Active Students",
      value: statsData?.activeStudents || "0",
      change: { value: "+8.2%", type: "increase", period: "from last month" },
      icon: Users,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50",
      accent: "bg-gradient-to-r from-indigo-500 to-indigo-600",
    },
    {
      title: "Verified Today",
      value: statsData?.verifiedToday || "0",
      change: { value: "+23.1%", type: "increase", period: "from yesterday" },
      icon: Shield,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      accent: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    },
    {
      title: "Success Rate",
      value: `${statsData?.successRate || 0}%`,
      change: { value: "+0.3%", type: "increase", period: "from last week" },
      icon: CheckCircle,
      iconColor: "text-violet-600",
      iconBg: "bg-violet-50",
      accent: "bg-gradient-to-r from-violet-500 to-violet-600",
    },
  ]

  const alertStats = [
    {
      title: "Pending Reviews",
      value: statsData?.pendingReviews || "0",
      icon: Clock,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      title: "Failed Verifications",
      value: statsData?.failedVerifications || "0",
      icon: AlertTriangle,
      iconColor: "text-red-600",
      iconBg: "bg-red-50",
      badgeClass: "bg-red-50 text-red-700 border-red-200",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      {/* Alert Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alertStats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="border border-slate-200/80 shadow-sm bg-white overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.iconBg)}>
                      <Icon className={cn("w-5 h-5", stat.iconColor)} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn("text-xs font-medium border", stat.badgeClass)}>
                    Needs Attention
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Certificate Trends Chart - 2 col wide */}
        <Card className="lg:col-span-2 border border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-slate-800">Certificate Trends</CardTitle>
                <CardDescription className="text-xs text-slate-400 mt-0.5">Monthly certificate processing overview</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs border-slate-200 text-slate-500">Last 7 months</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="certGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="verGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="certificates" name="Total" stroke="#3b82f6" strokeWidth={2} fill="url(#certGrad)" dot={false} activeDot={{ r: 5, fill: "#3b82f6" }} />
                <Area type="monotone" dataKey="verified" name="Verified" stroke="#10b981" strokeWidth={2} fill="url(#verGrad)" dot={false} activeDot={{ r: 5, fill: "#10b981" }} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" /><span className="text-xs text-slate-500">Total</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-xs text-slate-500">Verified</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Fraud Breakdown Pie - 1 col */}
        <Card className="border border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800">Verification Status</CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-0.5">Overall certificate authenticity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={fraudBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {fraudBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-1">
              {fraudBreakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-700">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Success Rate Bar Chart - full width */}
        <Card className="lg:col-span-3 border border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-slate-800">Weekly Success Rate</CardTitle>
                <CardDescription className="text-xs text-slate-400 mt-0.5">Verification success rate by day</CardDescription>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5" />
                Avg 96.1%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklySuccessData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis domain={[85, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rate" name="rate" radius={[6, 6, 0, 0]} fill="url(#barGrad)">
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  {weeklySuccessData.map((entry, index) => (
                    <Cell key={index} fill="url(#barGrad)" fillOpacity={entry.rate >= 97 ? 1 : 0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default StatsCards