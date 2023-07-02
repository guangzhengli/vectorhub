import {Label} from "@/components/ui/label";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs"
import {FileLoaderForm} from "@/components/Index/FileLoaderForm";
import {KeyConfiguration} from "@/types/keyConfiguration";

interface Props {
  keyConfiguration: KeyConfiguration;
  handleKeyConfigurationValidation: () => boolean;
}

export const IndexFormTabs = ({
                       keyConfiguration,
                       handleKeyConfigurationValidation,
                     }: Props) => {
  return (
    <>
      <Tabs defaultValue="FileLoader" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fileloader">FileLoader</TabsTrigger>
          <TabsTrigger value="webloader">WebLoader</TabsTrigger>
        </TabsList>
        <TabsContent value="fileloader">
          <Card>
            <CardHeader>
              <CardTitle className="ml-10">FileLoader</CardTitle>
              <CardDescription className="ml-10">
                Use File to upload your vector.
              </CardDescription>
            </CardHeader>
            <FileLoaderForm keyConfiguration={keyConfiguration}
                            handleKeyConfigurationValidation={handleKeyConfigurationValidation}/>
          </Card>
        </TabsContent>
        <TabsContent value="webloader">
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
    </>
  )
}