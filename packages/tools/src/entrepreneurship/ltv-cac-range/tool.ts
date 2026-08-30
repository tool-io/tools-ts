import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, positive } from "../shared.js";

export type Input = Readonly<{
  readonly lifetimeValue: number;
  readonly customerAcquisitionCost: number;
  readonly minimumRatio: number;
  readonly maximumRatio: number;
}>;
export type Output = Readonly<{
  readonly ltvCacRatio: number;
  readonly withinRange: boolean;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.lifetimeValue, "lifetimeValue");
  positive(input.customerAcquisitionCost, "customerAcquisitionCost");
  nonnegative(input.minimumRatio, "minimumRatio");
  if (input.maximumRatio < input.minimumRatio)
    simpleError("maximumRatio", "Ordered ratio limits required.");
  const ltvCacRatio = input.lifetimeValue / input.customerAcquisitionCost;
  return {
    ltvCacRatio,
    withinRange:
      ltvCacRatio >= input.minimumRatio && ltvCacRatio <= input.maximumRatio,
  };
};
export const exampleInput = {
  lifetimeValue: 300,
  customerAcquisitionCost: 100,
  minimumRatio: 3,
  maximumRatio: 5,
} satisfies Input;
export const exampleOutput = {
  ltvCacRatio: 3,
  withinRange: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/ltv-cac-range",
  title: "LTV CAC Range",
  description:
    "Compare lifetime value to acquisition cost against a caller-defined target band.",
  inputs: [
    { id: "lifetimeValue", label: "Lifetime value", kind: "number" },
    {
      id: "customerAcquisitionCost",
      label: "Customer acquisition cost",
      kind: "number",
    },
    { id: "minimumRatio", label: "Minimum ratio", kind: "number" },
    { id: "maximumRatio", label: "Maximum ratio", kind: "number" },
  ],
  outputs: [
    { id: "ltvCacRatio", label: "Ltv cac ratio", kind: "number" },
    { id: "withinRange", label: "Within range", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      lifetimeValue: value.lifetimeValue as number,
      customerAcquisitionCost: value.customerAcquisitionCost as number,
      minimumRatio: value.minimumRatio as number,
      maximumRatio: value.maximumRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
