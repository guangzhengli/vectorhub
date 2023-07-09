import * as z from "zod";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {useState} from "react";
import {AlertCircle, Loader2} from "lucide-react";

const indexFormSchema = z.object({
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

type IndexFormValues = z.infer<typeof indexFormSchema>

interface Props {
  indexId: string
  handleShowIndexFormTabs: (isShowIndexFormTabs: boolean) => void;
}

export const IndexForm = ({ indexId, handleShowIndexFormTabs } : Props) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useForm<IndexFormValues>({
    resolver: zodResolver(indexFormSchema),
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

  async function onSubmit(data: IndexFormValues) {
    if (indexId === '') {
      setErrorMessage('Index ID is missing, please refresh the page and try again.')
    }

    setIsSubmitting(true)

    await fetch('/api/indexes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: indexId,
        name: data.name,
        description: data.description,
        prompt: data.prompt,
        tags: data.tags?.map((tag) => tag.value),
        questions: data.questions?.map((question) => question.value),
        published: data.published,
        likesCount: 0,
      })
    }).then(async (res) => {
      setIsSubmitting(false)
      if (!res.ok) {
        const message = await res.text();
        console.log('save embedding failed: ', message);
        setErrorMessage(message)
      }
    });
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input className="max-w-sm" placeholder="Index name" {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input className="max-w-2xl" placeholder="This is a index for..." {...field} />
                </FormControl>
                <FormDescription>
                  Description will help other users better understand how to use it.
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
                    className="resize-none max-w-2xl"
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
            <FormLabel>
              Tags
            </FormLabel>
            <FormDescription className="mt-2">
              Add relevant tags to your index so that users can quickly discover it.
            </FormDescription>
            {tags.map((tag: any, index: any) => (
              <FormField
                control={form.control}
                key={tag.id}
                name={`tags.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="max-w-sm my-2" {...field} />
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
            <FormLabel>
              Good Questions
            </FormLabel>
            <FormDescription className="mt-2">
              Add the well-prepared questions to your index so that users can quickly learn how to use it.
            </FormDescription>
            {questions.map((question: any, index: any) => (
              <FormField
                control={form.control}
                key={question.id}
                name={`questions.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="max-w-4xl my-2" {...field} />
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
                    className="ml-2"
                    defaultChecked={true}
                    checked={field.value}
                    onCheckedChange={() => field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormDescription>
                    Please confirm whether publicly. If you choose not publicly, the system will delete this data regularly.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          {errorMessage && (
            <Alert className="max-w-md ml-16" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Create index failed: {errorMessage}
              </AlertDescription>
            </Alert>)}
          <div className="pb-4">
            <>
              {isSubmitting
              ? <Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait</Button>
              : <Button type="submit">Create new index</Button>
              }
            </>

            <Button variant="secondary" className="ml-8" onClick={() => handleShowIndexFormTabs(false)}>Cancel</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}