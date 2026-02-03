"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FloatingStepHeader } from "./floating-step-header";

export default function SignUpWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form States
  const [parentData, setParentData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [childData, setChildData] = useState({
    firstName: "",
    username: "",
    password: "",
  });

  // --- HANDLERS ---

  // Step 1: Create Parent & Auto Login
  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parentData),
      });

      if (!res.ok) throw new Error("Email already registered or invalid data.");

      const loginRes = await signIn("credentials", {
        email: parentData.email,
        password: parentData.password,
        redirect: false,
      });

      if (loginRes?.error) throw new Error("Account created but failed to log in.");

      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Create Child (Protected Route)
  const handleChildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/user/child", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(childData),
      });

      if (!res.ok) throw new Error("Failed to create child account. Try a different username.");

      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <div className="w-full max-w-md">
        {/* Premium Floating Header */}
        <FloatingStepHeader step={step} />

        {/* Main Card */}
        <Card className="border-primary/10 shadow-xl">
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            {/* STEP 1: PARENT FORM */}
            {step === 1 && (
              <form onSubmit={handleParentSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      required 
                      placeholder="Jane"
                      value={parentData.firstName}
                      onChange={(e) => setParentData({ ...parentData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      required 
                      placeholder="Doe"
                      value={parentData.lastName}
                      onChange={(e) => setParentData({ ...parentData, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    placeholder="parent@example.com"
                    value={parentData.email}
                    onChange={(e) => setParentData({ ...parentData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={parentData.password}
                    onChange={(e) => setParentData({ ...parentData, password: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                  {loading ? "Creating Account..." : "Next Step"}
                </Button>
              </form>
            )}

            {/* STEP 2: CHILD FORM */}
            {step === 2 && (
              <form onSubmit={handleChildSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="childName">Child's Name</Label>
                  <Input 
                    id="childName" 
                    required 
                    placeholder="Billy"
                    value={childData.firstName}
                    onChange={(e) => setChildData({ ...childData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childUsername">Username</Label>
                  <Input 
                    id="childUsername" 
                    required 
                    placeholder="billy_rocket"
                    value={childData.username}
                    onChange={(e) => setChildData({ ...childData, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childPassword">Child's Password</Label>
                  <Input 
                    id="childPassword" 
                    type="password" 
                    required 
                    placeholder="******"
                    value={childData.password}
                    onChange={(e) => setChildData({ ...childData, password: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                  {loading ? "Adding Child..." : "Complete Setup"}
                </Button>
              </form>
            )}

            {/* STEP 3: SUCCESS */}
            {step === 3 && (
              <div className="flex flex-col items-center justify-center space-y-6 py-6">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center animate-bounce shadow-lg">
                  <span className="text-4xl">🎉</span>
                </div>
                <div className="text-center text-muted-foreground">
                  <p>Welcome to the family!</p>
                  <p>You can now log in as either parent or child.</p>
                </div>
                <Button 
                  onClick={() => router.push("/dashboard")} 
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
          
          {step < 3 && (
            <CardFooter className="justify-center">
              <p className="text-xs text-muted-foreground">
                Already have an account? <a href="/login" className="text-primary underline">Log in</a>
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}