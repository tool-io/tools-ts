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
          "Spolia means reused earlier materials/elements, including architectural columns, with practical and symbolic interpretations.",
        reference: "Late antique/medieval architectural scholarship.",
        limitations:
          "Reuse does not automatically prove conquest, poverty or one deliberate ideological program.",
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
      text: "Spolia means reused earlier materials/elements, including architectural columns, with practical and symbolic interpretations.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/spolia-column-reuse-material-recycling-medieval-practice",
  title: "Spolia Column Reuse Material Recycling Medieval Practice",
  description:
    "Bounded offline reference: Spolia means reused earlier materials/elements, including architectural columns, with practical and symbolic interpretations. Source: Late antique/medieval architectural scholarship. Reuse does not automatically prove conquest, poverty or one deliberate ideological program. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
