"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Award,
  BarChart3,
  Upload,
  Shield,
  Users,
  Settings,
  FileText,
  Search,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  Database,
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
    title: "Certificates",
    href: "/dashboard/certificates",
    icon: Award,
    badge: "124",
    description: "Manage all certificates"
  },
  {
    title: "Upload",
    href: "/dashboard/upload",
    icon: Upload,
    description: "Upload new certificates"
  },
  {
    title: "Verify",
    href: "/dashboard/verify",
    icon: Shield,
    description: "Verify certificates"
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    description: "View detailed analytics"
  },
  {
    title: "Students",
    href: "/dashboard/students",
    icon: Users,
    badge: "1.2k",
    description: "Manage students"
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
    description: "Generate reports"
  },
  {
    title: "Search",
    href: "/dashboard/search",
    icon: Search,
    description: "Search certificates"
  }
]

const bottomItems = [
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Account settings"
  },
  {
    title: "Help",
    href: "/dashboard/help",
    icon: HelpCircle,
    description: "Get help and support"
  }
]

export default function DashboardSidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn(
      "flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                SmartCertify
              </span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-blue-600" : "text-gray-400")} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.title}
                    {item.badge && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Storage Usage */}
        {!isCollapsed && (
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Storage Usage</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Used</span>
                <span className="font-medium">2.4 GB / 10 GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{ width: '24%' }} />
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs">
                Upgrade Plan
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Items */}
      <div className="p-4 border-t border-gray-200">
        <nav className="space-y-2">
          {bottomItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-blue-600" : "text-gray-400")} />
                {!isCollapsed && (
                  <span className="flex-1">{item.title}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
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