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

const fileLoaderFormSchema = z.object({
  name: z
    .string({
      required_error: "Please enter a name.",
    })
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(30, {
      message: "name must not be longer than 30 characters.",
    }),
  description: z
    .string({
      required_error: "Please enter a description.",
    })
    .min(10, {
      message: "name must be at least 10 characters.",
    })
    .max(500, {
      message: "name must not be longer than 500 characters.",
    }),
  prompt: z
    .string()
    .min(10, {
      message: "name must be at least 10 characters.",
    })
    .max(500, {
      message: "name must not be longer than 500 characters.",
    }).optional(),
  tags: z
    .array(
      z.object({
        value: z.string().max(20).min(2),
      })
    )
    .optional(),
  questions: z
    .array(
      z.object({
        value: z.string().max(100).min(2),
      })
    )
    .optional(),
  published: z.boolean().default(true),
})

type FileLoaderFormValues = z.infer<typeof fileLoaderFormSchema>

interface Props {
  keyConfiguration: KeyConfiguration;
  handleKeyConfigurationValidation: () => boolean;
}

export const FileLoaderForm = ({
  keyConfiguration,
  handleKeyConfigurationValidation,
}: Props) => {
  const form = useForm<FileLoaderFormValues>({
    resolver: zodResolver(fileLoaderFormSchema),
    mode: "onChange",
  })

  const { fields: tags, append: appendTags } = useFieldArray({
    name: "tags",
    control: form.control,
  })

  const { fields: questions, append: appendQuestions } = useFieldArray({
    name: "questions",
    control: form.control,
  })

  function onSubmit(data: FileLoaderFormValues) {
    // onSummit
  }

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
          <Input id="file" type="file" />
        </div>
      )
    )
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Index name" {...field} />
              </FormControl>
              <FormDescription>
                This is index public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="This is a index for..." {...field} />
              </FormControl>
              <FormDescription>
                Please enter some description information as this is the public index description. This will help other users better understand how to use it.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="This is the user prompt for the index."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the user prompt for the index.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {tags.map((tag: any, index: any) => (
            <FormField
              control={form.control}
              key={tag.id}
              name={`tags.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...tag} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => appendTags({ value: "" })}
          >
            Add Tag
          </Button>
        </div>
        <div>
          {questions.map((question: any, index: any) => (
            <FormField
              control={form.control}
              key={question.id}
                name={`questions.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Good Questions
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => appendQuestions({ value: "" })}
          >
            Add Question
          </Button>
        </div>
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Publicly</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={() => field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Publicly ?
                </FormLabel>
                <FormDescription>
                  Please confirm whether to publish publicly. If you choose not to publish publicly, the system will delete this data regularly.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
    </>
  )
}