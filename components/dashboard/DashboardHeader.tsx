"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuthState, useAuthActions } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Search, User, Settings, LogOut, HelpCircle, Menu,
  X, FileText, Calendar, Loader2, Award,
} from "lucide-react"
import Link from "next/link"
import DashboardSidebar from "./DashboardSidebar"
import { certificateApi, Certificate } from "@/lib/certificate-api"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface DashboardHeaderProps {
  title?: string
  description?: string
}

function formatDate(d: string) {
  try { return format(new Date(d), "dd MMM yyyy") } catch { return d }
}

export default function DashboardHeader({ title, description }: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Certificate[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { user } = useAuthState()
  const { signout } = useAuthActions()
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Debounced search
  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchResults([]); setShowResults(false); return }
    setSearchLoading(true); setShowResults(true)
    try {
      const res = await certificateApi.searchCertificates(q)
      if (res.success) setSearchResults(res.data)
    } catch { setSearchResults([]) }
    finally { setSearchLoading(false) }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => { if (searchQuery) runSearch(searchQuery) }, 350)
    return () => clearTimeout(timer)
  }, [searchQuery, runSearch])

  const handleSignout = async () => {
    setSigningOut(true)
    try { await signout(); router.push("/") } finally { setSigningOut(false) }
  }

  const getInitials = () => {
    if (user?.username) return user.username.slice(0, 2).toUpperCase()
    if (user?.email) return user.email.slice(0, 2).toUpperCase()
    return "U"
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-4 px-5 py-3">

        {/* Mobile sidebar sheet */}
        <div className="md:hidden flex-shrink-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-600">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <DashboardSidebar className="border-r-0 h-full w-full" />
            </SheetContent>
          </Sheet>
        </div>

        {/* Page title */}
        <div className="hidden sm:block flex-shrink-0 min-w-0">
          {title && <h1 className="text-lg font-bold text-slate-900 truncate">{title}</h1>}
          {description && <p className="text-xs text-slate-500 truncate max-w-xs">{description}</p>}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search bar with live results */}
        <div ref={searchRef} className="relative hidden md:block w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchQuery) setShowResults(true) }}
            placeholder="Search certificates..."
            className="h-9 pl-9 pr-8 border-slate-200 bg-slate-50 focus:bg-white text-sm"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setSearchResults([]); setShowResults(false) }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Search results dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
              {searchLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600 mr-2" />
                  <span className="text-sm text-slate-500">Searching...</span>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-500">No certificates found for "{searchQuery}"</p>
                  <Link href="/dashboard/history" className="text-xs text-blue-600 hover:underline mt-1 block" onClick={() => setShowResults(false)}>
                    Browse all certificates →
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{searchResults.length} result{searchResults.length !== 1 ? "s" : ""}</p>
                  </div>
                  {searchResults.map(cert => (
                    <Link key={cert.id} href="/dashboard/history" onClick={() => setShowResults(false)}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{cert.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />Issued: {formatDate(cert.issueDate)}
                        </p>
                      </div>
                    </Link>
                  ))}
                  <div className="px-3 py-2 border-t border-slate-100">
                    <Link href="/dashboard/history" className="text-xs text-blue-600 hover:underline" onClick={() => setShowResults(false)}>
                      View all in history →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile / User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 rounded-full p-0 ring-2 ring-offset-1 ring-transparent hover:ring-blue-200 transition-all duration-150">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-bold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60" align="end" forceMount>
            <DropdownMenuLabel className="font-normal py-3 px-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-bold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {user?.username || user?.email?.split("@")[0] || "User"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || "—"}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard" className="flex items-center">
                <Award className="mr-2 h-4 w-4 text-slate-500" /><span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard/history" className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-slate-500" /><span>Certificate History</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="mailto:support@smartcertify.com" className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4 text-slate-500" /><span>Help & Support</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={cn("cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50", signingOut && "opacity-60 pointer-events-none")}
              onClick={handleSignout}
            >
              {signingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
              <span>{signingOut ? "Signing out..." : "Sign out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}