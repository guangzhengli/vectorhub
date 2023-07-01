import {zodResolver} from "@hookform/resolvers/zod"
import {useFieldArray, useForm} from "react-hook-form"
import * as z from "zod"
import {v4 as uuidv4} from 'uuid';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "../ui/form";
import {Input} from "../ui/input";
import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import { Label } from "../ui/label";
import { useState } from "react";
import { Progress } from "../ui/progress";
import { humanFileSize } from "@/utils/app/files";
import { CHAT_FILES_MAX_SIZE } from "@/utils/app/const";
import { KeyConfiguration } from "@/types/keyConfiguration";
import {IndexForm} from "@/components/Index/IndexForm";



interface Props {
  keyConfiguration: KeyConfiguration;
  handleKeyConfigurationValidation: () => boolean;
}

export const FileLoaderForm = ({
  keyConfiguration,
  handleKeyConfigurationValidation,
}: Props) => {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadFileIndexId, setUploadFileIndexId] = useState<string | null>(null);

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
        await uploadFile(file);

        setIsUploading(false);
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

    const uploadFile = async (file: File) => {
      const fileName = uuidv4();
      const fileType = file.name.split('.').pop()!;

      const formData = new FormData();
      formData.append("file", file);

      await fetch(`/api/files?fileName=${fileName}.${fileType}`, {
          method: 'POST',
          body: formData
      }).then(res => {
          if (!res.ok) {
              console.log("save file failed:", fileName);
              throw new Error(`save file failed:, ${fileName}`);
          }
      }).then(async (data: any) => {
          console.log("save file success:", fileName);
          setUploadProgress(50);
          await saveEmbeddings(fileName, fileType);
          setUploadProgress(100);
      });
  }

  const saveEmbeddings = async (fileName: string, fileType: string) => {
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
            fileName: fileName,
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
    (isUploading ? (
        <Progress value={uploadProgress} className="w-[60%]" />
      ) : (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="file">Upload File</Label>
          <Input id="file" type="file" onChange={() => handleFile}/>
        </div>
      )
    )
    <IndexForm />
    </>
  )
}