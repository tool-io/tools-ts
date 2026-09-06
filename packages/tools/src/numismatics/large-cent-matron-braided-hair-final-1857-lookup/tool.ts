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
          "US large cents ended in 1857; Matron/Coronet and Braided Hair are collector design-series terms with specific date ranges.",
        reference: "US Mint/US large-cent catalogues.",
        limitations:
          "Transitional types and terminology require exact references; not every large copper coin belongs to these series.",
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
      text: "US large cents ended in 1857; Matron/Coronet and Braided Hair are collector design-series terms with specific date ranges.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/large-cent-matron-braided-hair-final-1857-lookup",
  title: "Large Cent Matron Braided Hair Final 1857 Lookup",
  description:
    "Bounded offline reference: US large cents ended in 1857; Matron/Coronet and Braided Hair are collector design-series terms with specific date ranges. Source: US Mint/US large-cent catalogues. Transitional types and terminology require exact references; not every large copper coin belongs to these series. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
