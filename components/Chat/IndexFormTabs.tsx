import {Label} from "@/components/ui/label";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs"
import {FileLoaderForm} from "@/components/Index/FileLoaderForm";
import {KeyConfiguration} from "@/types/keyConfiguration";
import {Button} from "@/components/ui/button";

interface Props {
  keyConfiguration: KeyConfiguration;
  handleKeyConfigurationValidation: () => boolean;
  handleShowIndexFormTabs: (isShowIndexFormTabs: boolean) => void;
}

export const IndexFormTabs = (
  {
    keyConfiguration,
    handleKeyConfigurationValidation,
    handleShowIndexFormTabs,
  }: Props) => {
  return (
    <>
      <div className="bg-white dark:bg-[#343541] w-full">
        <Tabs defaultValue="fileloader">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fileloader">FileLoader</TabsTrigger>
            <TabsTrigger value="webloader">WebLoader</TabsTrigger>
          </TabsList>
          <TabsContent className="mt-2" value="fileloader">
            <Card>
              <CardHeader>
                <CardTitle className="ml-10">FileLoader</CardTitle>
                <CardDescription className="ml-10">
                  Use File to upload your vector.
                </CardDescription>
              </CardHeader>
              <FileLoaderForm keyConfiguration={keyConfiguration}
                              handleKeyConfigurationValidation={handleKeyConfigurationValidation}
                              handleShowIndexFormTabs={handleShowIndexFormTabs}/>
            </Card>
          </TabsContent>
          <TabsContent className="mt-2" value="webloader">
            <Card>
              <CardHeader>
                <CardTitle>WebLoader</CardTitle>
                <CardDescription>
                  Use Web page to upload your vector.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Coming Soon....</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}