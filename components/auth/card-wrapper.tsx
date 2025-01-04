"use client"
import Social from "./social";
import { BackButton } from "./back-button";
import { 
    Card,
    CardContent,
    CardHeader,
    CardFooter
 } from "../ui/card";

 import { Header } from "./header";
interface CardwrapperProps {
    children: React.ReactNode;
    headerLabel:string;
    backButtonlabel:string;
    backButtonHref:string;
    showSocial?:boolean;
}

export const Cardwrapper=({
    children,
    headerLabel,
    backButtonlabel,
    backButtonHref,
    showSocial
}:CardwrapperProps)=>{
    return(
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <Header label={headerLabel} />
            </CardHeader>
            <CardContent>
                {children}
           </CardContent>
           {showSocial && (
               <CardFooter>
                <Social />
                </CardFooter>
            )}
            <CardFooter>
                <BackButton
                label={backButtonlabel}
                href={backButtonHref}
                />
            </CardFooter>
        </Card>
    )
}