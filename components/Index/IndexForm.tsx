import * as z from "zod";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";

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

export const IndexForm = () => {
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

  function onSubmit(data: IndexFormValues) {
    // onSummit
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
                    checked={field.value}
                    onCheckedChange={() => field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormDescription>
                    Please confirm whether to publish publicly. If you choose not to publish publicly, the system will delete this data regularly.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="text-center">Create new index</Button>
        </form>
      </Form>
    </div>
  )
}