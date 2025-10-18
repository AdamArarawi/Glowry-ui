"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  RippleButton,
  RippleButtonRipples,
} from "@/components/animate-ui/components/buttons/ripple";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import LocationSelector from "@/components/ui/location-input";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const formSchema = z.object({
  username: z.string().min(1),
  email: z.string(),
  password: z.string(),
  password_confirm: z.string(),
  name_3313780317: z.tuple([z.string().min(1), z.string().optional()]),
  check_box: z.boolean(),
});

export default function MyForm() {
  const [, setCountryName] = useState<string>("");
  const [stateName, setStateName] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      password_confirm: "",
      name_3313780317: ["", ""],
      check_box: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      // toast(
      //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-auto">
      //     <code className="text-white">{JSON.stringify(values, null, 2)}</code>
      //   </pre>
      // );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div className="flex w-full justify-center items-center min-h-screen p-4 sm:p-10">
      <Card className="w-full max-w-full sm:max-w-lg shadow-lg border rounded-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Register</CardTitle>
          <CardDescription>
            Create a new account by filling out the form below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full"
            >
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="John doe" type="text" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your email address
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="******" {...field} />
                    </FormControl>
                    <FormDescription>Enter your password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="password_confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Confirm</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country & State */}
              <FormField
                control={form.control}
                name="name_3313780317"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Country</FormLabel>
                    <FormControl>
                      <LocationSelector
                        onCountryChange={(country) => {
                          setCountryName(country?.name || "");
                          form.setValue(field.name, [
                            country?.name || "",
                            stateName || "",
                          ]);
                        }}
                        onStateChange={(state) => {
                          setStateName(state?.name || "");
                          form.setValue(field.name, [
                            form.getValues(field.name)[0] || "",
                            state?.name || "",
                          ]);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      If your country has states, it will appear after selecting
                      country
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Checkbox */}
              <FormField
                control={form.control}
                name="check_box"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row items-start sm:space-x-3 space-y-2 sm:space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="grid gap-1 leading-snug break-words">
                      <FormLabel className="text-sm font-medium">
                        Accept terms and conditions
                      </FormLabel>
                      <p className="text-muted-foreground text-sm">
                        By clicking this checkbox, you agree to the terms and
                        conditions.
                      </p>
                      <FormMessage className="text-sm" />
                    </div>
                  </FormItem>
                )}
              />

              <CardFooter className="flex justify-end p-0">
                <Button type="submit" className="w-full sm:w-auto">
                  Submit
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
