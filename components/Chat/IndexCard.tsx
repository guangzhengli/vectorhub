import {FC, useCallback} from "react";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "../ui/card";
import {Heart} from "lucide-react";
import {Index} from "../../types/index";
import {Button} from "@/components/ui/button";
import {LlamaIndex} from "@/types/llamaIndex";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { MouseEvent } from 'react';

interface Props {
  onIndexChange: (index: LlamaIndex) => void;
  index: Index
}

export const IndexCard: FC<Props> = ({index, onIndexChange}: Props) => {

  const handleLikeIndex = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    console.log("asdfds")
  }, []);

  return (
    <>
      <Card className="rounded-xs cursor-pointer h-48 max-h-64 space-y-4 m-1 shadow-md hover:shadow-lg dark:bg-neutral-900" onClick={() => onIndexChange({indexName: index.name, indexId: index.id})}>
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
        <CardFooter>
          <div className="flex justify-between items-center space-x-2 w-full">
            <div className="rounded-none mr-1">
              { index.tags && index.tags.length > 0 && (
                <p className="text-xs border border-gray-400 rounded p-1">
                  {index.tags}
                </p>
              )}
            </div>
            <div>
              <Button variant="ghost" onClick={() => handleLikeIndex}>
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}