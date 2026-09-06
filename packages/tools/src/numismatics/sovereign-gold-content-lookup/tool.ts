import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Sovereign reference topic",
    kind: "string",
    enum: ["full", "half", "quarter", "double", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => ({
  text: pick(
    input.topic,
    {
      full: "Modern standard full sovereign:22 carat, approximately 7.98805 grams gross and 7.3224 grams fine gold.",
      half: "Modern standard half sovereign:approximately 3.9940 grams gross and 3.6612 grams fine gold at 22 carat.",
      quarter:
        "Modern standard quarter sovereign:approximately 1.9970 grams gross and 1.8306 grams fine gold at 22 carat.",
      double:
        "Modern standard double sovereign:approximately 15.9761 grams gross and 14.6448 grams fine gold at 22 carat.",
      reference:
        "Royal Mint, sovereign denomination specifications; nominal conventional 22 carat standard.",
      limitations:
        "Rounded nominal denomination reference, not measured assay, tolerance, metal valuation, medieval sovereign standard or authenticity.",
    },
    "topic",
  ),
});
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "full" },
  output: {
    result: {
      text: "Modern standard full sovereign:22 carat, approximately 7.98805 grams gross and 7.3224 grams fine gold.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/sovereign-gold-content-lookup",
  title: "Sovereign Gold Content Lookup",
  description:
    "Bounded nominal modern sovereign denomination reference:full, half, quarter, double, reference, limitations. Royal Mint denomination specifications, rounded22 carat convention. Not a generic assay calculation, medieval standard, measured tolerance, valuation or authentication.",
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
