import {Resend} from "resend";

const resend=new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail=async(
    email:string,
    token:string
)=>{
    const confirmLink=`${process.env.FRONTEND_URL}/auth/new-verification?token=${token}`

    await resend.emails.send({
        from:"onboarding@resend.dev",
        to:email,
        subject:"Confirm your email",
        html:`<a href="${confirmLink}">Click here to confirm your email</a>`

    })
}

export const sendPasswordResetEmail=async(
    email:string,
    token:string
)=>{
    const resetLink=`${process.env.FRONTEND_URL}/auth/new-password?token=${token}`

    await resend.emails.send({
        from:"onboarding@resend.dev",
        to:email,
        subject:"Reset Your Password",
        html:`<a href="${resetLink}">Click here to reset your password</a>`

    })
}

export const sendTwoFactorEmail=async(
    email:string,
    token:string
)=>{
    await resend.emails.send({
        from:"onboarding@resend.dev",
        to:email,
        subject:"2FA Code",
        html:`<p>Your 2FA code is: ${token}</p>`

    })
    
}