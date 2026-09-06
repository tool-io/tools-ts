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
          "Edo-period mon coinage included multiple denominations/materials and changing exchange relationships.",
        reference: "Japanese monetary-history scholarship.",
        limitations:
          "Nominal mon labels are not a fixed modern purchasing-power or metal-value ratio.",
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
      text: "Edo-period mon coinage included multiple denominations/materials and changing exchange relationships.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/japanese-monsen-edo-denominations-lookup",
  title: "Japanese Monsen Edo Denominations Lookup",
  description:
    "Bounded offline reference: Edo-period mon coinage included multiple denominations/materials and changing exchange relationships. Source: Japanese monetary-history scholarship. Nominal mon labels are not a fixed modern purchasing-power or metal-value ratio. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
