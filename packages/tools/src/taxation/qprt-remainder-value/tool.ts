import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly propertyValue: number;
  readonly annualDiscountRatePercent: number;
  readonly termYears: number;
}>;
export type Output = Readonly<{
  readonly retainedTermValue: number;
  readonly taxableRemainderValue: number;
  readonly remainderPercent: number;
}>;

export const calculate = (input: Input): Output => {
  const retainedTermValue =
    input.propertyValue /
    (1 + input.annualDiscountRatePercent / 100) ** input.termYears;
  const taxableRemainderValue = input.propertyValue - retainedTermValue;
  return {
    retainedTermValue,
    taxableRemainderValue,
    remainderPercent:
      input.propertyValue === 0
        ? 0
        : (taxableRemainderValue / input.propertyValue) * 100,
  };
};

export const exampleInput = {
  propertyValue: 1000,
  annualDiscountRatePercent: 10,
  termYears: 1,
} satisfies Input;
export const exampleOutput = {
  retainedTermValue: 909.090909090909,
  taxableRemainderValue: 90.90909090909099,
  remainderPercent: 9.090909090909099,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      propertyValue: input.propertyValue as number,
      annualDiscountRatePercent: input.annualDiscountRatePercent as number,
      termYears: input.termYears as number,
    }),
  description:
    "Model a QPRT remainder using caller-supplied property value, term, and discount rate.",
  id: "taxation/qprt-remainder-value",
  inputs: [
    {
      id: "propertyValue",
      label: "Property value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "annualDiscountRatePercent",
      label: "Annual discount rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "termYears",
      label: "QPRT term",
      kind: "integer",
      minimum: 0,
      unit: "years",
    },
  ],
  outputs: [
    {
      id: "retainedTermValue",
      label: "Modeled retained term value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "taxableRemainderValue",
      label: "Modeled taxable remainder value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "remainderPercent",
      label: "Remainder percentage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "QPRT Remainder Value",
});

export const run = tool.execute;
export default tool;
