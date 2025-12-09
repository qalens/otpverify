"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const signUpSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  email: z.string().email("Please enter a valid email address"),
})

type SignUpFormValues = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  })

  async function onSubmit(data: SignUpFormValues) {
    setIsLoading(true)
    setSubmitMessage(null)

    try {
      // Replace this with your actual API call
      console.log("Form submitted:", data)
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // })
      // if (!response.ok) throw new Error('Signup failed')

      setSubmitMessage({
        type: "success",
        text: "Sign up successful! Check your email for verification.",
      })
      form.reset()
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "An error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Sign up to get started
          </p>
        </div>

        {submitMessage && (
          <div
            className={`p-4 rounded-md text-sm ${
              submitMessage.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/auth/login" className="font-medium text-primary hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  )
}
