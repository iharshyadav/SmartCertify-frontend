"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Award,
  Home,
  Brain,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Database,
  FileText,
} from "lucide-react"

interface SidebarProps {
  className?: string
}

const navigationItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Home,
    description: "Dashboard overview and stats"
  },
  {
    title: "Certificate History",
    href: "/dashboard/history",
    icon: FileText,
    description: "All your uploaded certificates"
  },
  {
    title: "AI Verify",
    href: "/dashboard/ai-verify",
    icon: Brain,
    badge: "AI",
    description: "AI-powered fraud detection & analysis"
  }
]

const bottomItems = [
  {
    title: "Help",
    href: "mailto:support@smartcertify.com",
    icon: HelpCircle,
    description: "Get help and support"
  }
]

export default function DashboardSidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn(
      "hidden md:flex flex-col bg-white border-r border-slate-100 transition-all duration-300 shadow-sm",
      isCollapsed ? "w-[70px]" : "w-64",
      className
    )}>
      {/* Logo / Header */}
      <div className={cn(
        "flex items-center border-b border-slate-100 h-16 px-4",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-blue-200 transition-shadow duration-200">
              <Award className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-base font-bold text-slate-800 tracking-tight">
              SmartCertify
            </span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <Award className="w-4 h-4 text-white" />
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn("p-1.5 h-7 w-7 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md flex-shrink-0", isCollapsed && "ml-auto hidden")}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <div className="flex justify-center pt-3 pb-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(false)}
            className="p-1.5 h-7 w-7 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Navigation Label */}
      {!isCollapsed && (
        <div className="px-4 pt-5 pb-2">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Menu</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 flex flex-col px-3 py-2">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-150",
                  isActive ? "bg-blue-100" : "bg-slate-100 group-hover:bg-slate-200"
                )}>
                  <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-500")} />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{item.title}</span>
                    {item.badge && (
                      <Badge className="text-[10px] px-1.5 py-0 h-4 bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 font-semibold">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                )}
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 shadow-lg">
                    {item.title}
                  </div>
                )}
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-l-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Storage Usage */}
        {!isCollapsed && (
          <div className="mt-6 mx-1 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/60">
            <div className="flex items-center space-x-2 mb-3">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-slate-700">Storage</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>2.4 GB used</span>
                <span className="font-medium text-slate-700">10 GB</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500" style={{ width: '24%' }} />
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs h-7 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800">
                Upgrade Plan
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Items */}
      <div className="px-3 py-3 border-t border-slate-100">
        <nav className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all duration-150 group relative"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center flex-shrink-0 transition-colors duration-150">
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>
                {!isCollapsed && <span>{item.title}</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 shadow-lg">
                    {item.title}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}