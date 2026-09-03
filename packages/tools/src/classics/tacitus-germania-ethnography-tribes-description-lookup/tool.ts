import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Tacitus Germania is a Roman ethnographic text structured by literary, moral and imperial concerns.",
        reference: "Tacitus, Germania.",
        limitations:
          "Not a neutral complete tribal census, racial doctrine or proof of modern national identity.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "summary" },
  output: {
    result: {
      text: "Tacitus Germania is a Roman ethnographic text structured by literary, moral and imperial concerns.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/tacitus-germania-ethnography-tribes-description-lookup",
  title: "Tacitus Germania Ethnography Tribes Description Lookup",
  description:
    "Bounded offline reference: Tacitus Germania is a Roman ethnographic text structured by literary, moral and imperial concerns. Source: Tacitus, Germania. Not a neutral complete tribal census, racial doctrine or proof of modern national identity. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
