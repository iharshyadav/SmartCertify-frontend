import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Award,
  Users,
  Shield,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: string
    type: "increase" | "decrease"
    period: string
  }
  icon: React.ElementType
  iconColor: string
  iconBg: string
}

function StatsCard({ title, value, change, icon: Icon, iconColor, iconBg }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            {change && (
              <div className="flex items-center space-x-1">
                {change.type === "increase" ? (
                  <TrendingUp className="w-3 h-3 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600" />
                )}
                <span className={cn(
                  "text-xs font-medium",
                  change.type === "increase" ? "text-green-600" : "text-red-600"
                )}>
                  {change.value}
                </span>
                <span className="text-xs text-gray-500">{change.period}</span>
              </div>
            )}
          </div>
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBg)}>
            <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function StatsCards() {
  const stats = [
    {
      title: "Total Certificates",
      value: "2,847",
      change: {
        value: "+12.5%",
        type: "increase" as const,
        period: "from last month"
      },
      icon: Award,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100"
    },
    {
      title: "Active Students",
      value: "1,234",
      change: {
        value: "+8.2%",
        type: "increase" as const,
        period: "from last month"
      },
      icon: Users,
      iconColor: "text-green-600",
      iconBg: "bg-green-100"
    },
    {
      title: "Verified Today",
      value: "156",
      change: {
        value: "+23.1%",
        type: "increase" as const,
        period: "from yesterday"
      },
      icon: Shield,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100"
    },
    {
      title: "Success Rate",
      value: "98.7%",
      change: {
        value: "+0.3%",
        type: "increase" as const,
        period: "from last week"
      },
      icon: CheckCircle,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100"
    }
  ]

  const alertStats = [
    {
      title: "Pending Reviews",
      value: "12",
      icon: Clock,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100"
    },
    {
      title: "Failed Verifications",
      value: "3",
      icon: AlertTriangle,
      iconColor: "text-red-600",
      iconBg: "bg-red-100"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alertStats.map((stat, index) => (
          <Card key={index} className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <Badge variant="outline" className="text-xs">
                    Needs attention
                  </Badge>
                </div>
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", stat.iconBg)}>
                  <stat.icon className={cn("w-6 h-6", stat.iconColor)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}