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
          "Prescription/paramedical data may inform underwriting subject to consent, accuracy and applicable restrictions.",
        reference: "Insurance privacy and underwriting disclosures.",
        limitations:
          "Drug names do not uniquely diagnose conditions or predict individual mortality; no personal health data requested.",
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
      text: "Prescription/paramedical data may inform underwriting subject to consent, accuracy and applicable restrictions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/prescription-database-paramed-mortality-lens-data-lookup",
  title: "Prescription Database Paramed Mortality Lens Data Lookup",
  description:
    "Bounded offline reference: Prescription/paramedical data may inform underwriting subject to consent, accuracy and applicable restrictions. Source: Insurance privacy and underwriting disclosures. Drug names do not uniquely diagnose conditions or predict individual mortality; no personal health data requested. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
