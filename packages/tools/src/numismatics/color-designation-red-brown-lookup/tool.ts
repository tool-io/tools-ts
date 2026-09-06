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
          "RD, RB and BN are grading-service colour designations used for eligible copper issues.",
        reference: "PCGS/NGC copper colour designation guidance.",
        limitations:
          "RD means red, RB red-brown, BN brown; eligibility and percentage criteria vary by service and era, not automatically inferred from RGB pixels.",
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
      text: "RD, RB and BN are grading-service colour designations used for eligible copper issues.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/color-designation-red-brown-lookup",
  title: "Color Designation Red Brown Lookup",
  description:
    "Bounded offline reference: RD, RB and BN are grading-service colour designations used for eligible copper issues. Source: PCGS/NGC copper colour designation guidance. RD means red, RB red-brown, BN brown; eligibility and percentage criteria vary by service and era, not automatically inferred from RGB pixels. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
