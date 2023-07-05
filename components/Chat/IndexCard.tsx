import {FC} from "react";
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "../ui/card";
import {Users} from "lucide-react";
import {Index} from "../../types/index";
import {Button} from "@/components/ui/button";
import {LlamaIndex} from "@/types/llamaIndex";
import {useSession} from "next-auth/react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface Props {
  onIndexChange: (index: LlamaIndex) => void;
  index: Index
}

export const IndexCard: FC<Props> = ({index, onIndexChange}: Props) => {

  return (
    <>
      <Card className="cursor-pointer max-h-32 shadow-md hover:shadow-lg" onClick={() => onIndexChange({indexName: index.name, indexId: index.id})}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">
            {index.name}
          </CardTitle>
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={index.author?.image ? index.author?.image : 'https://avatars.githubusercontent.com/u/138222923'}/>
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{index.author?.name ? index.author?.name : 'unknown'}</p>
              </div>
            </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">{index.description}</div>
        </CardContent>
        {/*TODO: add tags in card footer*/}
        {/*<CardFooter>*/}
        {/*  { index.tags && index.tags.length > 0 && (*/}
        {/*    <p className="text-xs border border-gray-400 rounded p-1">*/}
        {/*      {index.tags}*/}
        {/*    </p>*/}
        {/*  )}*/}
        {/*</CardFooter>*/}
      </Card>
    </>
  )
}