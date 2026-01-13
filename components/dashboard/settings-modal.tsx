'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { updateProfile } from '@/app/actions/user'
import { Loader2, Moon, Sun, Monitor, CreditCard, User, Settings as SettingsIcon } from 'lucide-react'
import { toast } from 'sonner'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface SettingsModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    user: SupabaseUser
}

export function SettingsModal({ isOpen, onOpenChange, user }: SettingsModalProps) {
    const { theme, setTheme } = useTheme()
    const [isLoading, setIsLoading] = useState(false)

    // Profile Form Handling
    async function onProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await updateProfile(formData)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Profile updated successfully')
            onOpenChange(false)
        }
        setIsLoading(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] h-[400px] flex flex-col p-0 gap-0 overflow-hidden bg-background border-border shadow-2xl">
                <div className="flex flex-1 h-full">
                    {/* Sidebar Tabs - Left Side */}
                    <Tabs defaultValue="profile" orientation="vertical" className="flex w-full h-full">
                        <div className="w-[180px] border-r border-border bg-muted/20 p-4 shrink-0 flex flex-col gap-2">
                            <div className="mb-4 px-2">
                                <h2 className="font-bold text-lg flex items-center gap-2">
                                    <SettingsIcon className="w-5 h-5 text-primary" />
                                    Settings
                                </h2>
                            </div>

                            <TabsList className="flex flex-col h-auto bg-transparent gap-1 p-0 justify-start w-full">
                                <TabsTrigger
                                    value="profile"
                                    className="w-full justify-start gap-2 px-3 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm h-9"
                                >
                                    <User className="w-4 h-4" />
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger
                                    value="appearance"
                                    className="w-full justify-start gap-2 px-3 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm h-9"
                                >
                                    <Monitor className="w-4 h-4" />
                                    Appearance
                                </TabsTrigger>
                                <TabsTrigger
                                    value="billing"
                                    className="w-full justify-start gap-2 px-3 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm h-9"
                                >
                                    <CreditCard className="w-4 h-4" />
                                    Billing
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Content Area - Right Side */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            <TabsContent value="profile" className="mt-0 space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg">Profile</h3>
                                    <p className="text-sm text-muted-foreground">Manage your public profile settings.</p>
                                </div>

                                <form onSubmit={onProfileSubmit} className="space-y-4 pt-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            value={user.email}
                                            disabled
                                            className="bg-muted opacity-50"
                                        />
                                        <p className="text-[10px] text-muted-foreground">Email cannot be changed.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Display Name</Label>
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            defaultValue={user.user_metadata?.full_name || ''}
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </TabsContent>

                            <TabsContent value="appearance" className="mt-0 space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg">Appearance</h3>
                                    <p className="text-sm text-muted-foreground">Customize how Piely looks on your device.</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-2">
                                    <button
                                        onClick={() => setTheme('light')}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50'}`}
                                    >
                                        <div className="p-2 rounded-full bg-white border shadow-sm">
                                            <Sun className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <span className="text-sm font-medium">Light</span>
                                    </button>

                                    <button
                                        onClick={() => setTheme('dark')}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50'}`}
                                    >
                                        <div className="p-2 rounded-full bg-slate-950 border shadow-sm">
                                            <Moon className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <span className="text-sm font-medium">Dark</span>
                                    </button>

                                    <button
                                        onClick={() => setTheme('system')}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50'}`}
                                    >
                                        <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 border shadow-sm">
                                            <Monitor className="w-6 h-6 text-foreground" />
                                        </div>
                                        <span className="text-sm font-medium">System</span>
                                    </button>
                                </div>
                            </TabsContent>

                            <TabsContent value="billing" className="mt-0 space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg">Billing</h3>
                                    <p className="text-sm text-muted-foreground">Manage your subscription and billing details.</p>
                                </div>

                                <div className="bg-muted/30 p-4 rounded-xl border border-border">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h4 className="font-bold">Free Plan</h4>
                                            <p className="text-xs text-muted-foreground">You are currently on the free plan.</p>
                                        </div>
                                        <div className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded uppercase tracking-wider">
                                            Active
                                        </div>
                                    </div>

                                    <Button variant="outline" className="w-full" asChild>
                                        <a href="/pricing">Upgrade Plan</a>
                                    </Button>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    )
}
