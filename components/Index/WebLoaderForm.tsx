import {KeyConfiguration} from "@/types/keyConfiguration";
import {IndexForm} from "@/components/Index/IndexForm";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle, CheckCheck} from "lucide-react";
import {Progress} from "@/components/ui/progress";
import {Label} from "@/components/ui/label";
import {humanFileSize} from "@/utils/app/files";
import {CHAT_FILES_MAX_SIZE} from "@/utils/app/const";
import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {createId} from "@paralleldrive/cuid2";
import {Button} from "@/components/ui/button";

interface Props {
  keyConfiguration: KeyConfiguration;
  handleKeyConfigurationValidation: () => boolean;
  handleShowIndexFormTabs: (isShowIndexFormTabs: boolean) => void;
}

export const WebLoaderForm = (
  {
    keyConfiguration,
    handleKeyConfigurationValidation,
    handleShowIndexFormTabs
  }: Props) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadFileIndexId, setUploadFileIndexId] = useState<string>('');
  const [uploadWebPageUrl, setUploadWebPageUrl] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      setUploadProgress(progress => (progress + 1) % 101)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const handleWebPage = async () => {
    if (!handleKeyConfigurationValidation()) {
      return;
    }

    if (!uploadWebPageUrl) {
      setIsUploadSuccess(false);
      setUploadError('Please enter a valid URL.')
      return;
    }

    setIsUploading(true);
    try {
      const indexId = createId();

      await saveWebPageEmbeddings(indexId, uploadWebPageUrl);

      setUploadFileIndexId(indexId);
      setIsUploading(false);
      setUploadWebPageUrl(uploadWebPageUrl)
      setIsUploadSuccess(true)
    } catch (e) {
      console.error(e);
      setUploadError((e as Error).message);
      setIsUploading(false);
      setIsUploadSuccess(false)
    }
  }

  const saveWebPageEmbeddings = async (indexId: string, webPageUrl: string) => {
    await fetch('/api/embeddings/webpage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-type': keyConfiguration.apiType ?? '',
        'x-api-key': keyConfiguration.apiKey ?? '',
        'x-api-model': keyConfiguration.apiModel ?? '',
        'x-azure-api-key': keyConfiguration.azureApiKey ?? '',
        'x-azure-instance-name': keyConfiguration.azureInstanceName ?? '',
        'x-azure-api-version': keyConfiguration.azureApiVersion ?? '',
        'x-azure-deployment-name': keyConfiguration.azureDeploymentName ?? '',
        'x-azure-embedding-deployment-name': keyConfiguration.azureEmbeddingDeploymentName ?? '',
      },
      body: JSON.stringify({
        indexId: indexId,
        webPageUrl: webPageUrl,
      })
    }).then(async (res) => {
      if (!res.ok) {
        const message = await res.text();
        console.log('save webpage embedding failed: ', message);
        throw new Error(`save webpage embedding failed: ' ${message}`);
      }
    });
  }

  return (
    <>
      <div className="space-x-16">
        {isUploadSuccess ? (
            <>
              <Alert className="max-w-md ml-16 border-green-500">
                <CheckCheck className="h-4 w-4"/>
                <AlertTitle>Upload success!</AlertTitle>
                <AlertDescription>
                  WebPage {uploadWebPageUrl} has been uploaded successfully.
                </AlertDescription>
              </Alert>
            </>
          ) :
          (
            <>
              {isUploading ? (
                <>
                  <Progress value={uploadProgress} className="w-[60%] ml-16"/>
                </>
              ) : (
                <>
                  {uploadError ? (
                    <>
                      <Alert className="max-w-md ml-16" variant="destructive">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                          Upload failed: {uploadError}
                        </AlertDescription>
                      </Alert>
                    </>
                  ) : (
                    <div className="max-w-2xlg space-x-16">
                      <Label className="ml-16" htmlFor="index">Webpage URL, this feature is not very stable.</Label>

                      <div className="flex w-full max-w-2xl items-center  mt-2">
                        <Input type="url" className="" placeholder="https://news.ycombinator.com/item?id=xxx" onChange={(event) =>setUploadWebPageUrl(event.target.value)}/>
                        <Button type="submit" className="ml-4" onClick={() => handleWebPage()}> Upload</Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )
        }


        <IndexForm indexId={uploadFileIndexId} handleShowIndexFormTabs={handleShowIndexFormTabs}/>
      </div>
    </>
  )
}