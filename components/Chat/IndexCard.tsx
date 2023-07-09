import {FC, useCallback, useEffect, useState} from "react";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "../ui/card";
import {Heart} from "lucide-react";
import {Index} from "../../types/index";
import {Button} from "@/components/ui/button";
import {LlamaIndex} from "@/types/llamaIndex";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { MouseEvent } from 'react';
import { Badge } from "../ui/badge";
import {Label} from "@/components/ui/label";

interface Props {
  onIndexChange: (index: LlamaIndex) => void;
  index: Index
}

export const IndexCard: FC<Props> = ({index, onIndexChange}: Props) => {

  const [isIndexCurrentUserLiked, setIsIndexCurrentUserLiked] = useState(!!(index.likes && index.likes.length > 0));
  const [heartBackground, setHeartBackground] = useState('');
  const [indexLikesCount, setIndexLikesCount] = useState(index.likesCount ? index.likesCount : undefined);

  const handleLikeIndex = async () => {
    if (isIndexCurrentUserLiked) {
      setHeartBackground('')
      setIndexLikesCount(indexLikesCount ? indexLikesCount - 1 : 0)
      await fetch('/api/indexes/user/likes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          indexId: index.id,
        })
      }).then(async (res) => {
        if (!res.ok) {
          const message = await res.text();
          console.log(`like index error: ${message}, the index id is ${index.id}`);
          setHeartBackground("text-red-600 dark: text-red-700")
          setIndexLikesCount(indexLikesCount ? indexLikesCount + 1 : 0)
        } else {
          setIsIndexCurrentUserLiked(false);
        }
      });
    } else {
      setHeartBackground("text-red-600 dark: text-red-700")
      setIndexLikesCount(indexLikesCount ? indexLikesCount + 1 : 1)
      await fetch('/api/indexes/user/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          indexId: index.id,
        })
      }).then(async (res) => {
        if (!res.ok) {
          const message = await res.text();
          console.log(`like index error: ${message}, the index id is ${index.id}`);
          setHeartBackground("")
          setIndexLikesCount(indexLikesCount ? indexLikesCount - 1 : 1)
        } else {
          setIsIndexCurrentUserLiked(true);
        }
      });
    }
  };

  useEffect(() => {
    if (isIndexCurrentUserLiked) {
      setHeartBackground("text-red-500 dark: text-red-700")
    }
  }, [isIndexCurrentUserLiked]);

  return (
    <>
      <Card className="rounded-xs cursor-pointer h-48 max-h-64 space-y-4 m-1 shadow-md hover:shadow-lg dark:bg-neutral-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" onClick={() => onIndexChange({indexName: index.name, indexId: index.id})}>
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
        <CardContent onClick={() => onIndexChange({indexName: index.name, indexId: index.id})}>
          <div className="text-sm font-medium">{index.description}</div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-between items-center space-x-2 w-full">
            <div className="rounded-none mr-1">
              { index.tags && index.tags.length > 0 && (
                <>
                  { index.tags.map((tag, key) => (
                    <Badge key={key} variant="outline" className="mr-1">{tag}</Badge>
                  )) }
                </>
              )}
            </div>
            <div>
              <Button variant="ghost" onClick={handleLikeIndex}>
                <Heart className={heartBackground} />
                <div className="ml-2">
                  {indexLikesCount?.toString()}
                </div>
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}