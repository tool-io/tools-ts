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
          "CDW/LDW can waive specified rental damage responsibility; primary/secondary terminology describes ordering relative to other applicable protection.",
        reference: "Rental contracts and insurer/card benefit guides.",
        limitations:
          "Waivers need not be insurance; exclusions, location and reporting rules must be verified.",
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
      text: "CDW/LDW can waive specified rental damage responsibility; primary/secondary terminology describes ordering relative to other applicable protection.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/rental-car-cdw-primary-secondary-lookup",
  title: "Rental Car CDW Primary Secondary Lookup",
  description:
    "Bounded offline reference: CDW/LDW can waive specified rental damage responsibility; primary/secondary terminology describes ordering relative to other applicable protection. Source: Rental contracts and insurer/card benefit guides. Waivers need not be insurance; exclusions, location and reporting rules must be verified. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
