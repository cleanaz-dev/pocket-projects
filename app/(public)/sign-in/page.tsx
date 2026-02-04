"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { z } from "zod";

const signInSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

type SignInData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const handleSubmit = async (data: SignInData) => {
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        emailOrUsername: data.emailOrUsername,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error("Invalid email/username or password");
      }

      if (res?.ok) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const session = await getSession();
        const userType = (session?.user as any)?.type;
        const userTypeLowerCase = userType?.toLowerCase();

        console.log("Session:", session);
        console.log("User type:", userTypeLowerCase);

        if (!userTypeLowerCase) {
          throw new Error("Login succeeded but user type was not found in session.");
        }

        router.push(`/${userTypeLowerCase}/dashboard`);
      }
    } catch (err: any) {
      console.error("Sign-in error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <div className="w-full max-w-md">
        <div className="pb-8">
          <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
          <div className="flex justify-center font-['Pacifico'] text-primary text-4xl md:text-6xl [text-shadow:_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_2px_2px_0_#fff,_-2px_0_0_#fff,_2px_0_0_#fff,_0_-2px_0_#fff,_0_2px_0_#fff]">
            Sign In
          </div>
        </div>

        <Card className="border-primary/10 shadow-xl">
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailOrUsername">Email or Username</Label>
                <Input
                  id="emailOrUsername"
                  type="text"
                  placeholder="email@example.com or username"
                  {...form.register("emailOrUsername")}
                />
                {form.formState.errors.emailOrUsername && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.emailOrUsername.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-xs text-muted-foreground">
              Don't have an account? <a href="/sign-up" className="text-primary underline">Sign up</a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}