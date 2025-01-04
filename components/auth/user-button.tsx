"use client"

import{
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Avatar,AvatarFallback,AvatarImage } from "../ui/avatar"
import { FaUser } from "react-icons/fa"
import { LogoutButton } from "./logout-button"
import { LogOut } from "lucide-react"

const UserButton = () => {
    const user=useCurrentUser()
  return (
  <DropdownMenu>
    <DropdownMenuTrigger>
        <Avatar>
            <AvatarImage src={user?.image||""}/>
            <AvatarFallback className="bg-sky-500">
            <FaUser className="text-white"/>
            </AvatarFallback>
        </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem>
            <LogoutButton><LogOut className="h-4 w-4 mr-2 inline"/>Logout</LogoutButton>
        </DropdownMenuItem>
        </DropdownMenuContent>
  </DropdownMenu>
    
  )
}

export default UserButton
