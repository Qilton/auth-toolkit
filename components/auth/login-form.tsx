"use client"
import * as z from "zod";
import { useState } from "react";
import { useTransition } from "react";
import { LoginSchema } from '@/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Cardwrapper } from './card-wrapper';
import { Input } from "../ui/input";
import { Form, FormField, FormControl, FormLabel, FormItem, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
const LoginForm = () => {
    const searchParams = useSearchParams();
    const callbackUrl=searchParams.get("callbackUrl")||"/";
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider" : ""


    const [error, setError] = useState<string | undefined>("");
    const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition()


    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })
    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");
        startTransition(() => {

            login(values,callbackUrl)
                .then((data) => {
                    if (data?.error) {
                        form.reset();
                        setError(data.error)
                    }
                    if (data?.success) {
                        form.reset();
                        setSuccess(data.success)
                    }
                    if (data?.twoFactor) {
                        setShowTwoFactor(true)
                    }
                })
                .catch(() => { setError("Something went wrong!") })
        });
    }
    return (
        <Cardwrapper
            headerLabel='Welcome back'
            backButtonHref='/auth/register'
            backButtonlabel='Dont have an account?'
            showSocial
        >
            <Form {...form}>
                <>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            {showTwoFactor && (
                                 <FormField
                                 control={form.control}
                                 name="code"
                                 render={({ field }) => (
                                     <FormItem>
                                         <FormLabel>Two Factor Code</FormLabel>
                                         <FormControl>
                                             <Input
                                                 {...field}
                                                 disabled={isPending}
                                                 placeholder="123456"
                                                 type="text"
                                             />
                                         </FormControl>
                                         <FormMessage />
                                     </FormItem>
                                 )}
                             />)}
                            {!showTwoFactor &&(
                                <>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="john.doe@gmail.com"
                                                    type="text"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isPending}
                                                    {...field}
                                                    placeholder="****"
                                                    type="password"
                                                />
                                            </FormControl>
                                            <Button
                                                size="sm"
                                                variant="link"
                                                asChild
                                                className="px-0 font-normal"
                                            >
                                                < Link href="/auth/reset">Forgot Password?</Link>
                                            </Button>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>)}
                        </div>
                        <FormError message={error || urlError} />
                        <FormSuccess message={success} />
                        <Button
                            disabled={isPending}
                            type="submit"
                            className="w-full"
                        >
                           { showTwoFactor?"Confirm":"Login"}
                        </Button>
                    </form>
                </>
            </Form>

        </Cardwrapper>
    )
}

export default LoginForm;
