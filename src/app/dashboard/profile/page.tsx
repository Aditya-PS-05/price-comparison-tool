'use client';

import React from 'react';
import { Sidebar } from '../../../components/dashboard/Sidebar';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { User, Settings, Globe, Bell, Key, Shield } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="flex h-screen bg-[#0D0F17] text-white">
      <Sidebar />
      
      <main className="flex-1 p-6 overflow-y-auto bg-[#11131C]">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Profile</h1>
              <p className="text-gray-400">Manage your account settings and preferences</p>
            </div>
            <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-600">
              <User className="w-3 h-3 mr-1" />
              Active Account
            </Badge>
          </div>

          {/* Profile Overview */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your basic account details and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Full Name</label>
                    <input 
                      type="text" 
                      value="John Doe"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <input 
                      type="email" 
                      value="john.doe@example.com"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Default Country</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Germany</option>
                      <option>France</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Preferred Currency</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                      <option>CAD - Canadian Dollar</option>
                      <option>JPY - Japanese Yen</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Time Zone</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC+0 (London)</option>
                      <option>UTC+1 (Central Europe)</option>
                      <option>UTC+9 (Japan)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Language</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Japanese</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <Button>Save Changes</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Price Alerts</span>
                    <div className="w-10 h-6 bg-blue-600 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Email Updates</span>
                    <div className="w-10 h-6 bg-gray-600 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Weekly Reports</span>
                    <div className="w-10 h-6 bg-blue-600 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Search Preferences
                </CardTitle>
                <CardDescription>Customize your search experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Max Results</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-white text-sm">
                      <option>25</option>
                      <option>50</option>
                      <option>100</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Default Sort</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-white text-sm">
                      <option>Best Match</option>
                      <option>Lowest Price</option>
                      <option>Highest Rating</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security
                </CardTitle>
                <CardDescription>Account security settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full">
                    <Key className="w-3 h-3 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Shield className="w-3 h-3 mr-2" />
                    Enable 2FA
                  </Button>
                  <div className="text-xs text-gray-400 mt-2">
                    Last login: Today at 2:30 PM
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Stats */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Account Statistics</CardTitle>
              <CardDescription>Your activity and usage overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">127</div>
                  <div className="text-sm text-gray-400">Total Searches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">23</div>
                  <div className="text-sm text-gray-400">Saved Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">8</div>
                  <div className="text-sm text-gray-400">Active Alerts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">$2,340</div>
                  <div className="text-sm text-gray-400">Money Saved</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}