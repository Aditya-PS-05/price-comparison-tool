'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../../components/dashboard/Sidebar';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { User, Calendar, Mail, Globe, Clock } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/profile');
    }
  }, [session, status, router]);

  // Show loading while session is being checked
  if (status === 'loading') {
    return (
      <div className="flex h-screen bg-[#0D0F17] text-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#0D0F17] text-white">
      <Sidebar />
      
      <main className="flex-1 p-6 overflow-y-auto bg-[#11131C]">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Profile</h1>
              <p className="text-gray-400">Your account information</p>
            </div>
            <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-600">
              <User className="w-3 h-3 mr-1" />
              Active Account
            </Badge>
          </div>

          {/* User Information */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your basic account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <User className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-sm text-gray-400">Full Name</div>
                      <div className="text-white">{session.user?.name || 'Not provided'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <Mail className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-sm text-gray-400">Email Address</div>
                      <div className="text-white">{session.user?.email}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <Globe className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-sm text-gray-400">Default Country</div>
                      <div className="text-white">{session.user?.defaultCountry || 'US'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <div>
                      <div className="text-sm text-gray-400">Preferred Currency</div>
                      <div className="text-white">{session.user?.defaultCurrency || 'USD'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Account Statistics</CardTitle>
              <CardDescription>Your activity and usage overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">0</div>
                  <div className="text-sm text-gray-400">Total Searches</div>
                </div>
                <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">0</div>
                  <div className="text-sm text-gray-400">Saved Items</div>
                </div>
                <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">0</div>
                  <div className="text-sm text-gray-400">Active Alerts</div>
                </div>
                <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400">$0</div>
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