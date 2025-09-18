import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Award,
  Upload,
  Shield,
  User,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  FileText,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityItem {
  id: string
  type: "upload" | "verify" | "approve" | "reject" | "view"
  title: string
  description: string
  user: {
    name: string
    avatar?: string
    initials: string
  }
  timestamp: string
  status: "success" | "pending" | "failed" | "info"
  certificateId?: string
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "upload",
    title: "New certificate uploaded",
    description: "Bachelor of Science in Computer Engineering",
    user: {
      name: "John Doe",
      initials: "JD"
    },
    timestamp: "2 minutes ago",
    status: "pending",
    certificateId: "CRT-2024-001"
  },
  {
    id: "2",
    type: "verify",
    title: "Certificate verified",
    description: "Master of Business Administration",
    user: {
      name: "Sarah Wilson",
      initials: "SW"
    },
    timestamp: "15 minutes ago",
    status: "success",
    certificateId: "CRT-2024-002"
  },
  {
    id: "3",
    type: "approve",
    title: "Certificate approved",
    description: "Doctor of Philosophy in Data Science",
    user: {
      name: "Michael Chen",
      initials: "MC"
    },
    timestamp: "1 hour ago",
    status: "success",
    certificateId: "CRT-2024-003"
  },
  {
    id: "4",
    type: "reject",
    title: "Certificate rejected",
    description: "Invalid signature detected",
    user: {
      name: "Emma Davis",
      initials: "ED"
    },
    timestamp: "2 hours ago",
    status: "failed",
    certificateId: "CRT-2024-004"
  },
  {
    id: "5",
    type: "view",
    title: "Certificate viewed",
    description: "Bachelor of Arts in Psychology",
    user: {
      name: "David Kim",
      initials: "DK"
    },
    timestamp: "3 hours ago",
    status: "info",
    certificateId: "CRT-2024-005"
  },
  {
    id: "6",
    type: "upload",
    title: "Bulk upload completed",
    description: "125 certificates processed successfully",
    user: {
      name: "Admin System",
      initials: "AS"
    },
    timestamp: "5 hours ago",
    status: "success"
  }
]

function getActivityIcon(type: ActivityItem["type"], status: ActivityItem["status"]) {
  const baseClass = "w-4 h-4"
  
  switch (type) {
    case "upload":
      return <Upload className={cn(baseClass, "text-blue-600")} />
    case "verify":
      return <Shield className={cn(baseClass, "text-purple-600")} />
    case "approve":
      return <CheckCircle className={cn(baseClass, "text-green-600")} />
    case "reject":
      return <XCircle className={cn(baseClass, "text-red-600")} />
    case "view":
      return <Eye className={cn(baseClass, "text-gray-600")} />
    default:
      return <FileText className={cn(baseClass, "text-gray-600")} />
  }
}

function getStatusBadge(status: ActivityItem["status"]) {
  switch (status) {
    case "success":
      return <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Success</Badge>
    case "pending":
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">Pending</Badge>
    case "failed":
      return <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">Failed</Badge>
    case "info":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">Info</Badge>
    default:
      return null
  }
}

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          <CardDescription>Latest certificate management activities</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-sm">
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback className="text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {activity.user.initials}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                {getActivityIcon(activity.type, activity.status)}
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                {getStatusBadge(activity.status)}
              </div>
              
              <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{activity.user.name}</span>
                <span>{activity.timestamp}</span>
              </div>
              
              {activity.certificateId && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    {activity.certificateId}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-gray-100">
          <Button variant="outline" className="w-full text-sm">
            <Clock className="w-4 h-4 mr-2" />
            Load More Activities
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}