import {FC} from "react";
import {signOut, useSession} from 'next-auth/react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Skeleton} from "@/components/ui/skeleton"
import {Button} from "@/components/ui/button"
import Link from "next/link";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"

interface Props {

}

export const Profile: FC<Props> = () => {
  const {data: session, status} = useSession();

  if (status === 'loading') {
    return (
      <>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-[250px]"/>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]"/>
            <Skeleton className="h-4 w-[200px]"/>
          </div>
        </div>
      </>
    )
  }

  if (status === 'unauthenticated' || !session) {
    return (
      <>
        <Button asChild>
          <Link href="/api/auth/signin">Login</Link>
        </Button>
      </>
    )
  }

  if (session) {
    return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
          <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={session?.user?.image ? session?.user?.image : 'https://avatars.githubusercontent.com/u/138222923'}/>
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-md font-medium leading-none">{session?.user?.name}</p>
                  <p className="text-xs font-medium mt-1">{session?.user?.email}</p>
                </div>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            <Button className="w-full" onClick={() => signOut()}>
              Log out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>)
  }

  return null;
}
