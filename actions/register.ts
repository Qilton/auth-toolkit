"use server"
import { RegisterSchema } from "@/schemas";

import { db } from "@/lib/db";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register=async(values:z.infer<typeof RegisterSchema>)=>{
    const validatedFields=RegisterSchema.safeParse(values);
    if(!validatedFields.success){
       return {error:"Invalid Fields!"}
    }
    const{email,password,name}=validatedFields.data;
    const hashedPassword=await bcrypt.hash(password,10);

    const existingUser=await getUserByEmail(email);

    if(existingUser){
        return {error:"User already exists!"}
    }

    await db.user.create({
        data:{
            email,
            name,
            password:hashedPassword
        }
    });


    const verificationToken=await generateVerificationToken(email);
    
    
    await sendVerificationEmail(verificationToken.email,verificationToken.token);

    return {success:"Confirmation email sent!"}
}