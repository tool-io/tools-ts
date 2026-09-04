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
          "Holi observances can combine colour play, seasonal celebration and Holika narratives; Holika Dahan is a bonfire observance in particular settings.",
        reference: "South Asian festival scholarship.",
        limitations:
          "Not a universal theological explanation or safe colour/fire-use instruction.",
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
      text: "Holi observances can combine colour play, seasonal celebration and Holika narratives; Holika Dahan is a bonfire observance in particular settings.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/holi-colors-holika-dahan-story-behind-lookup",
  title: "Holi Colors Holika Dahan Story Behind Lookup",
  description:
    "Bounded offline reference: Holi observances can combine colour play, seasonal celebration and Holika narratives; Holika Dahan is a bonfire observance in particular settings. Source: South Asian festival scholarship. Not a universal theological explanation or safe colour/fire-use instruction. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
