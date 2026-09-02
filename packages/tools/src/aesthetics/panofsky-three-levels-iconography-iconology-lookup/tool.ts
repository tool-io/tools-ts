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
          "Panofsky distinguishes pre-iconographical description, iconographical analysis and iconological interpretation.",
        reference: "Panofsky, Studies in Iconology 1939.",
        limitations:
          "Levels interact and require historical evidence; no image-to-meaning automation.",
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
      text: "Panofsky distinguishes pre-iconographical description, iconographical analysis and iconological interpretation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/panofsky-three-levels-iconography-iconology-lookup",
  title: "Panofsky Three Levels Iconography Iconology Lookup",
  description:
    "Bounded offline reference: Panofsky distinguishes pre-iconographical description, iconographical analysis and iconological interpretation. Source: Panofsky, Studies in Iconology 1939. Levels interact and require historical evidence; no image-to-meaning automation. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
