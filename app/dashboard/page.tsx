"use client"

import ProtectedRoute from "@/components/auth/ProtectedRoute"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import StatsCards from "@/components/dashboard/StatsCards"
import RecentActivity from "@/components/dashboard/RecentActivity"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  Shield,
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
  FileText,
  Award,
  ArrowRight,
  Plus,
  Download,
} from "lucide-react"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader 
            title="Dashboard Overview" 
            description="Welcome back! Here's what's happening with your certificates."
          />
          
          <main className="flex-1 p-6 space-y-6 overflow-auto">
            {/* Stats Cards */}
            <StatsCards />
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Upload className="w-5 h-5 mr-2" />
                Upload Certificate
              </Button>
              <Button variant="outline" className="h-16">
                <Shield className="w-5 h-5 mr-2" />
                Verify Certificate
              </Button>
              <Button variant="outline" className="h-16">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" className="h-16">
                <FileText className="w-5 h-5 mr-2" />
                Generate Report
              </Button>
            </div>
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <RecentActivity />
              </div>
              
              {/* Side Panel */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Today's Summary</CardTitle>
                    <CardDescription>Key metrics for today</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Certificates Processed</span>
                      <Badge variant="secondary">156</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <Badge className="bg-green-100 text-green-800">98.7%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pending Reviews</span>
                      <Badge variant="outline">12</Badge>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Processing Queue</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recent Certificates */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                      <CardTitle className="text-lg">Recent Certificates</CardTitle>
                      <CardDescription>Latest uploaded certificates</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        id: "CRT-2024-001",
                        title: "Computer Science Degree",
                        student: "John Doe",
                        status: "verified",
                        date: "2 hours ago"
                      },
                      {
                        id: "CRT-2024-002",
                        title: "MBA Certificate",
                        student: "Sarah Wilson",
                        status: "pending",
                        date: "4 hours ago"
                      },
                      {
                        id: "CRT-2024-003",
                        title: "PhD in Data Science",
                        student: "Michael Chen",
                        status: "verified",
                        date: "1 day ago"
                      }
                    ].map((cert, index) => (
                      <div key={cert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{cert.title}</p>
                          <p className="text-xs text-gray-600">{cert.student}</p>
                          <div className="flex items-center justify-between mt-1">
                            <Badge 
                              variant={cert.status === 'verified' ? 'default' : 'secondary'}
                              className={cert.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                            >
                              {cert.status}
                            </Badge>
                            <span className="text-xs text-gray-500">{cert.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full text-sm">
                      View All Certificates
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
                
                {/* System Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">System Status</CardTitle>
                    <CardDescription>All systems operational</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">AI Processing</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Blockchain Network</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Connected</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Storage</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-yellow-600">75% Used</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <Button variant="outline" className="w-full text-sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export System Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Certificate Trends</CardTitle>
                  <CardDescription>Monthly certificate processing overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Chart visualization would go here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verification Success Rate</CardTitle>
                  <CardDescription>Success rate trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Chart visualization would go here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
