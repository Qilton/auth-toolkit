"use client"
import * as z from "zod";
import { useState } from "react";
import { useTransition } from "react";
import { NewPasswordSchema } from "@/schemas";
import {  useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Cardwrapper } from './card-wrapper';
import { Input } from "../ui/input";
import { Form,FormField, FormControl, FormLabel, FormItem, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { newPassword } from "@/actions/newPassword";
import { useSearchParams } from "next/navigation";

const NewPasswordForm = () => {
    const searchParams=useSearchParams();
    const token=searchParams.get("token");
   
    const[error,setError]=useState<string|undefined>("");
    const[success,setSuccess]=useState<string|undefined>("");
    const [isPending,startTransition]=useTransition()
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
        }
    })
    const onSubmit=async(values:z.infer<typeof NewPasswordSchema>)=>{
        setError("");
        setSuccess("");
        startTransition(()=>{

            newPassword(values,token)
            .then((data)=>{
                setError(data?.error)
                setSuccess(data?.success)
            })
        });
    }
    return (
        <Cardwrapper
            headerLabel='Enrt your new password'
            backButtonHref='/auth/login'
            backButtonlabel='Back to login'
          
        >
       <Form {...form}>
    <>
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={isPending}
                                    placeholder="******"
                                    type="password"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
              
            </div>
            <FormError message={error }/>
            <FormSuccess message={success}/>
            <Button
            disabled={isPending}
            type="submit"
            className="w-full"
            >
                    Reset Password
            </Button>
        </form>
    </>
</Form>

        </Cardwrapper>
    )
}

export default NewPasswordForm;
