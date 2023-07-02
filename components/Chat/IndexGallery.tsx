import {useEffect, useState} from "react";
import {IndexCard} from "./IndexCard";
import {useSession} from "next-auth/react";
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "../ui/tabs";
import {Button} from "../ui/button";
import {ArrowBigDownDash} from "lucide-react";
import {KeyConfiguration} from "@/types/keyConfiguration";
import {Index} from "@/types/index";

interface Props {
  keyConfiguration: KeyConfiguration;
  handleKeyConfigurationValidation: () => boolean;
  handleShowIndexFormTabs: (isShowIndexFormTabs: boolean) => void;
}

export const IndexGallery = ({
                               keyConfiguration,
                               handleKeyConfigurationValidation,
                               handleShowIndexFormTabs,
                             }: Props) => {
  const {data: session, status} = useSession();
  const [page, setPage] = useState(1);
  const [indexes, setIndexes] = useState<Index[]>([])
  const [userIndexes, setUserIndexes] = useState<Index[]>([])
  const [userLikedIndexes, setUserLikedIndexes] = useState<Index[]>([])

  useEffect(() => {
    const fetchAllIndexes = async () => {
      const response = await fetch(`/api/indexes`)
      const data = await response.json();
      setIndexes([...indexes, ...data]);
    };
    fetchAllIndexes();
  }, [page]);

  useEffect(() => {
    const fetchUserIndexes = async () => {
      const response = await fetch(`/api/indexes/user/${session?.user?.id}`)
      const data = await response.json();
      setUserIndexes(data);
    };
    fetchUserIndexes();
  }, []);

  useEffect(() => {
    const fetchUserLikedIndexes = async () => {
      const response = await fetch(`/api/indexes/user/${session?.user?.id}/likes`)
      const data = await response.json();
      setUserLikedIndexes(data);
    };
    fetchUserLikedIndexes();
  }, []);

  function handleLoadMore() {
    setPage(page + 1);
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">My created vector</h2>
        </div>
        <Tabs defaultValue="created" className="space-y-4">
          <TabsList>
            <TabsTrigger value="created">Created</TabsTrigger>
            <TabsTrigger value="likeed">Liked</TabsTrigger>
          </TabsList>
          <TabsContent value="created" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {userIndexes.map((index) => (
                <IndexCard key={index.id} index={index}/>
              ))}
              <Button onClick={() => handleShowIndexFormTabs(true)}>
                <ArrowBigDownDash className="mr-2 h-4 w-4"/> Create new index
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="likeed" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {userLikedIndexes.map((index) => (
                <IndexCard key={index.id} index={index}/>
              ))}
              <Button onClick={() => handleShowIndexFormTabs(true)}>
                <ArrowBigDownDash className="mr-2 h-4 w-4"/> Create new index
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Vector Hub</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {indexes.map((index) => (
            <IndexCard key={index.id} index={index}/>
          ))}
        </div>
        <Button onClick={handleLoadMore}>
          <ArrowBigDownDash className="mr-2 h-4 w-4"/> Load More
        </Button>
      </div>
    </>
  )
}