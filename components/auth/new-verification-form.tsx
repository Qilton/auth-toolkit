"use client";
import { Cardwrapper } from "./card-wrapper";
import {BeatLoader} from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { newVerification } from "@/actions/new-verification-action";
import { useState } from "react";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

const NewVerificationForm = () => {
    const[error,setError]=useState<string|undefined>("");
    const[success,setSuccess]=useState<string|undefined>("");

    const searchParams=useSearchParams();

    const token=searchParams.get("token");
    console.log(token)

    const onSubmit=useCallback(()=>{
        if(!token){
            setError("Missing Token")
            return
        } 
        newVerification(token)
        .then((data)=>{
            setError(data?.error)
            setSuccess(data?.success)
            })
            .catch(()=>{setError("Something went wrong!")})
    },[token])

    useEffect(()=>{
        onSubmit()
    },[onSubmit])

    return (

        <Cardwrapper
            headerLabel="Confirming your email"
            backButtonHref="/auth/login"
            backButtonlabel="Back to Login"
        >
            <div className="flex items-center w-full justify-center">
              {!error && !success &&  ( <BeatLoader/>)}
            </div>

            <FormSuccess message={success}/>
            <FormError message={error}/>

        </Cardwrapper>
    )
}

export default NewVerificationForm
