import {FC} from "react";
import {Card, CardHeader, CardTitle, CardContent} from "../ui/card";
import {Users} from "lucide-react";
import {Index} from "../../types/index";
import {Button} from "@/components/ui/button";
import {LlamaIndex} from "@/types/llamaIndex";

interface Props {
  onIndexChange: (index: LlamaIndex) => void;
  index: Index
}

export const IndexCard: FC<Props> = ({index, onIndexChange}: Props) => {
  return (
    <>
      <Card className="cursor-pointer" onClick={() => onIndexChange({indexName: index.name, indexId: index.id})}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {index.name}
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground"/>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{index.description}</div>
          <p className="text-xs text-muted-foreground">
            {index.tags}
          </p>
        </CardContent>
      </Card>
    </>
  )
}