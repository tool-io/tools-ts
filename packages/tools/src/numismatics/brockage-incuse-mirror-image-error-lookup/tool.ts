import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Brockage can produce an incuse, mirror-image impression from a coin acting as a die-contact surface.",
        reference: "Mint-error literature.",
        limitations:
          "A mirrored design alone does not authenticate a mint error; post-mint fabrication and other mechanisms must be assessed.",
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
      text: "Brockage can produce an incuse, mirror-image impression from a coin acting as a die-contact surface.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/brockage-incuse-mirror-image-error-lookup",
  title: "Brockage Incuse Mirror Image Error Lookup",
  description:
    "Bounded offline reference: Brockage can produce an incuse, mirror-image impression from a coin acting as a die-contact surface. Source: Mint-error literature. A mirrored design alone does not authenticate a mint error; post-mint fabrication and other mechanisms must be assessed. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
