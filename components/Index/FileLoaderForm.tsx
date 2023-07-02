import {v4 as uuidv4} from 'uuid';
import {Label} from "../ui/label";
import {useEffect, useState} from "react";
import {Progress} from "../ui/progress";
import {humanFileSize} from "@/utils/app/files";
import {CHAT_FILES_MAX_SIZE} from "@/utils/app/const";
import {KeyConfiguration} from "@/types/keyConfiguration";
import {IndexForm} from "@/components/Index/IndexForm";
import {Input} from "@/components/ui/input";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle, CheckCheck} from "lucide-react";
import { Prisma } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';


interface Props {
  keyConfiguration: KeyConfiguration;
  handleKeyConfigurationValidation: () => boolean;
}

export const FileLoaderForm = ({
  keyConfiguration,
  handleKeyConfigurationValidation,
}: Props) => {
  const [fileName, setFileName] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadFileIndexId, setUploadFileIndexId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setUploadProgress(progress => (progress + 1) % 101)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const handleFile = async (file: File) => {
    if (!handleKeyConfigurationValidation()) {
        return;
    }
    if (!validateFile(file)) {
        setIsUploadSuccess(false);
        return;
    }

    setIsUploading(true);
    try {
        const indexId = createId();
        const fileType = file.name.split('.').pop()!;

        await uploadFile(file, indexId, fileType);
        await saveEmbeddings(indexId, fileType);

        setIsUploading(false);
        setFileName(file.name)
        setIsUploadSuccess(true)
    } catch (e) {
        console.error(e);
        setUploadError((e as Error).message);
        setIsUploading(false);
        setIsUploadSuccess(false)
    }
  };

  const validateFile = (file: File) => {
    console.log(`upload file size: ${humanFileSize(file.size)}`);
    console.log(`file max size: ${humanFileSize(CHAT_FILES_MAX_SIZE)}`);
    if (CHAT_FILES_MAX_SIZE != 0 && file.size > CHAT_FILES_MAX_SIZE) {
        setUploadError(`Please select a file smaller than ${humanFileSize(CHAT_FILES_MAX_SIZE)}`);
        return false;
    }

    console.log(`upload file type: ${file.name.split('.').pop()!}`);
    if (!validateFileType(file.name.split('.').pop()!)) {
        setUploadError(`Please upload file of these types: ${supportFileType}`);
        return false;
    }

    return true;
  };

  const supportFileType = "pdf, epub, docx, txt, md, csv, json, zip";

    function validateFileType(fileType: string): boolean {
        switch (fileType) {
            case "pdf":
            case "epub":
            case "docx":
            case "txt":
            case "md":
            case "csv":
            case "zip":
            case "json":
                return true;
            default:
                return false;
        }
    }

    const uploadFile = async (file: File, indexId: string, fileType: string) => {

      const formData = new FormData();
      formData.append("file", file);

      await fetch(`/api/files?fileName=${indexId}.${fileType}`, {
          method: 'POST',
          body: formData
      }).then(res => {
          if (!res.ok) {
              console.log("save file failed:", indexId);
              throw new Error(`save file failed:, ${indexId}`);
          }
      });
  }

  const saveEmbeddings = async (indexId: string, fileType: string) => {
    await fetch('/api/embedding', {
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
            fileType: fileType,
        })
    }).then(async (res) => {
        if (!res.ok) {
            const message = await res.text();
            console.log('save embedding failed: ', message);
            throw new Error(`save embedding failed: ' ${message}`);
        }
    });
  }

  return (
    <>
      <div className="space-x-16">
        { isUploadSuccess ? (
          <>
            <Alert className="max-w-md ml-16 border-green-500">
              <CheckCheck className="h-4 w-4" />
              <AlertTitle>Upload success!</AlertTitle>
              <AlertDescription>
                File {fileName} has been uploaded successfully.
              </AlertDescription>
            </Alert>
          </>
        ) :
          (
            <>
              { isUploading ? (
                <>
                  <Progress value={uploadProgress} className="w-[60%] ml-16" />
                </>
              ) : (
                <>
                  { uploadError ? (
                    <>
                      <Alert className="max-w-md ml-16" variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                          Upload failed: {uploadError}
                        </AlertDescription>
                      </Alert>
                    </>
                  ) : (
                    <div className="max-w-sm space-x-16">
                      <Label className="ml-16" htmlFor="index">Choose a file to upload</Label>
                      <Input id="index" type="file" className="h-14 mt-2" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFile(e.target.files[0]).then(r => console.log("upload file success"));
                        }}}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )
        }
        <IndexForm />
      </div>
    </>
  )
}