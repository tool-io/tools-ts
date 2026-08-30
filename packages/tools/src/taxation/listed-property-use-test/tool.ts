import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly businessUse: number;
  readonly totalUse: number;
  readonly minimumBusinessUsePercent: number;
}>;
export type Output = Readonly<{
  readonly businessUsePercent: number;
  readonly meetsThreshold: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.totalUse <= 0 || input.businessUse > input.totalUse)
    simpleError(
      "totalUse",
      "Total use must be positive and at least business use.",
      "invalid_use",
    );
  const businessUsePercent = (input.businessUse / input.totalUse) * 100;
  return {
    businessUsePercent,
    meetsThreshold: businessUsePercent >= input.minimumBusinessUsePercent,
  };
};

export const exampleInput = {
  businessUse: 600,
  totalUse: 1000,
  minimumBusinessUsePercent: 50,
} satisfies Input;
export const exampleOutput = {
  businessUsePercent: 60,
  meetsThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      businessUse: input.businessUse as number,
      totalUse: input.totalUse as number,
      minimumBusinessUsePercent: input.minimumBusinessUsePercent as number,
    }),
  description:
    "Calculate listed-property business-use percentage and compare it with a caller-supplied threshold.",
  id: "taxation/listed-property-use-test",
  inputs: [
    { id: "businessUse", label: "Business use", kind: "number", minimum: 0 },
    { id: "totalUse", label: "Total use", kind: "number", minimum: 0 },
    {
      id: "minimumBusinessUsePercent",
      label: "Minimum business-use percentage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "businessUsePercent",
      label: "Business-use percentage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    { id: "meetsThreshold", label: "Meets threshold", kind: "boolean" },
  ],
  title: "Listed-Property Use Test",
});

export const run = tool.execute;
export default tool;
