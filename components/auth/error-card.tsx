import { Cardwrapper } from "./card-wrapper"
import { TriangleAlert } from "lucide-react"
export const ErrorCard=()=>{
    return(
      <Cardwrapper
      headerLabel="Oops!Something went wrong!"
      backButtonHref="/auth/login"
      backButtonlabel="Back to login"
      >
        <div className="w-full flex justify-center items-center">
            <TriangleAlert className="text-destructive"/>
        </div>
      </Cardwrapper>
    )
}