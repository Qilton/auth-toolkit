import NextAuth,{DefaultSession} from "next-auth"
import authConfig from "./auth.config"
import {PrismaAdapter} from "@auth/prisma-adapter"
 import { db } from "./lib/db"
 import { getUserById } from "./data/user"
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"
 export type ExtendedUser=DefaultSession["user"] &{
    role:"ADMIN"|"USER"
 }

 declare module "next-auth"{
    interface Session{
        user:ExtendedUser
    }
 }
export const { 
    auth, 
    handlers, 
    signIn,
    signOut
 } = NextAuth({
    pages:{
        signIn:"/auth/login",
        error:"/auth/error"
    },
    events:{
       async linkAccount({user}){
            await db.user.update({
                where:{id:user.id},
                data:{emailVerified:new Date()}
            })
        }
    },
    callbacks:{
        async signIn({user,account}){
            //Allow Oauth without email Verification
            if(account?.provider!="credentials") return true;

            if (!user.id) throw new Error("User ID is undefined");
            const existingUser = await getUserById(user.id);
            
            //Prevent singIn without email verification
            if(!existingUser?.emailVerified) return false

            if(existingUser.isTwoFactorEnabled){
                const twoFactorConfirmation=await getTwoFactorConfirmationByUserId(existingUser.id);

                if(!twoFactorConfirmation) return false

                //Delete two factor confirmation for next sign in
                await db.twoFactorConfirmation.delete({
                    where:{
                        id:twoFactorConfirmation.id
                    }
                })
            

            return true
        }},

        async session({token,session}){
           if(token.sub&&session.user){
            session.user.id=token.sub;
           }
           if(token.role&& session.user){
            session.user.role=token.role as UserRole;
           }
           return session;
        },
        async jwt({token}){
            if(!token.sub) return token
        const existingUser=await getUserById(token.sub);
        if(!existingUser) return token;

        token.role=existingUser.role;

        return token
        
        }
    },
    adapter: PrismaAdapter(db),
    session:{strategy:"jwt"},
...authConfig
});