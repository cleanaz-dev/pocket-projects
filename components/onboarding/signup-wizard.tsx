"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FloatingStepHeader } from "./floating-step-header";
import SignUpText from "./sign-up-text";
import {
  parentSignUpSchema,
  childSignUpSchema,
  type ParentSignUpData,
  type ChildSignUpData,
} from "@/lib/zod/schemas";

export default function SignUpWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Parent Form
  const parentForm = useForm<ParentSignUpData>({
    resolver: zodResolver(parentSignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  // Child Form
  const childForm = useForm<ChildSignUpData>({
    resolver: zodResolver(childSignUpSchema),
    defaultValues: {
      firstName: "",
      username: "",
      password: "",
    },
  });

  // --- HANDLERS ---

  // Step 1: Create Parent & Auto Login
  const handleParentSubmit = async (data: ParentSignUpData) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Email already registered or invalid data.");

      const loginRes = await signIn("credentials", {
        email: data.email,
        password: data.password,
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
  const handleChildSubmit = async (data: ChildSignUpData) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/user/child", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
        {/* Sign Up Text */}
        <SignUpText />
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
              <form onSubmit={parentForm.handleSubmit(handleParentSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Jane"
                      {...parentForm.register("firstName")}
                    />
                    {parentForm.formState.errors.firstName && (
                      <p className="text-xs text-destructive">
                        {parentForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...parentForm.register("lastName")}
                    />
                    {parentForm.formState.errors.lastName && (
                      <p className="text-xs text-destructive">
                        {parentForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="parent@example.com"
                    {...parentForm.register("email")}
                  />
                  {parentForm.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {parentForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...parentForm.register("password")}
                  />
                  {parentForm.formState.errors.password && (
                    <p className="text-xs text-destructive">
                      {parentForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                  {loading ? "Creating Account..." : "Next Step"}
                </Button>
              </form>
            )}

            {/* STEP 2: CHILD FORM */}
            {step === 2 && (
              <form onSubmit={childForm.handleSubmit(handleChildSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="childName">Child's Name</Label>
                  <Input
                    id="childName"
                    placeholder="Billy"
                    {...childForm.register("firstName")}
                  />
                  {childForm.formState.errors.firstName && (
                    <p className="text-xs text-destructive">
                      {childForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childUsername">Username</Label>
                  <Input
                    id="childUsername"
                    placeholder="billy_rocket"
                    {...childForm.register("username")}
                  />
                  {childForm.formState.errors.username && (
                    <p className="text-xs text-destructive">
                      {childForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childPassword">Child's Password</Label>
                  <Input
                    id="childPassword"
                    type="password"
                    placeholder="******"
                    {...childForm.register("password")}
                  />
                  {childForm.formState.errors.password && (
                    <p className="text-xs text-destructive">
                      {childForm.formState.errors.password.message}
                    </p>
                  )}
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