import type { FormProps, FormSchema } from "remix-forms";
import { createForm } from "remix-forms";
import {
  Form as FrameworkForm,
  useActionData,
  useSubmit,
  useNavigation,
} from "@remix-run/react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const RemixForm = createForm({
  component: FrameworkForm,
  useNavigation,
  useSubmit,
  useActionData,
});

export { RemixForm };

export function Form<Schema extends FormSchema>(props: FormProps<Schema>) {
  return (
    <RemixForm<Schema>
      inputComponent={Input}
      labelComponent={(props) => {
        return <Label {...(props as any)} />;
      }}
      multilineComponent={Textarea}
      buttonComponent={(props) => {
        return (
          <Button
            className="w-full"
            variant="default"
            type="submit"
            {...(props as any)}
          >
            Submit
          </Button>
        );
      }}
      {...props}
    />
  );
}
