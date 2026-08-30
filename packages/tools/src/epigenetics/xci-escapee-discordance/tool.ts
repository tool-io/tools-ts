import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly expressionMajor: number;
  readonly expressionMinor: number;
  readonly methylationMajor: number;
  readonly methylationMinor: number;
  readonly minimumExpressionSkew: number;
  readonly maximumMethylationSkew: number;
}>;
export type Output = Readonly<{
  readonly expressionSkew: number;
  readonly methylationSkew: number;
  readonly discordant: boolean;
}>;

export const calculate = (input: Input): Output => {
  const e = input.expressionMajor + input.expressionMinor,
    m = input.methylationMajor + input.methylationMinor;
  if (e <= 0 || m <= 0)
    simpleError("expressionMajor", "Totals must be positive.");
  const expressionSkew =
      Math.abs(input.expressionMajor - input.expressionMinor) / e,
    methylationSkew =
      Math.abs(input.methylationMajor - input.methylationMinor) / m;
  return {
    expressionSkew,
    methylationSkew,
    discordant:
      expressionSkew >= input.minimumExpressionSkew &&
      methylationSkew <= input.maximumMethylationSkew,
  };
};

export const exampleInput = {
  expressionMajor: 80,
  expressionMinor: 20,
  methylationMajor: 50,
  methylationMinor: 50,
  minimumExpressionSkew: 0.6,
  maximumMethylationSkew: 0.1,
} satisfies Input;
export const exampleOutput = {
  expressionSkew: 0.6,
  methylationSkew: 0.0,
  discordant: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/xci-escapee-discordance",
  title: "XCI Escapee Discordance",
  description:
    "Flag XCI escapee candidates with expression skew but balanced methylation.",
  inputs: [
    { id: "expressionMajor", kind: "number", label: "Expression major" },
    { id: "expressionMinor", kind: "number", label: "Expression minor" },
    { id: "methylationMajor", kind: "number", label: "Methylation major" },
    { id: "methylationMinor", kind: "number", label: "Methylation minor" },
    {
      id: "minimumExpressionSkew",
      kind: "number",
      label: "Minimum expression skew",
    },
    {
      id: "maximumMethylationSkew",
      kind: "number",
      label: "Maximum methylation skew",
    },
  ],
  outputs: [
    { id: "expressionSkew", kind: "number", label: "Expression skew" },
    { id: "methylationSkew", kind: "number", label: "Methylation skew" },
    { id: "discordant", kind: "boolean", label: "Discordant" },
  ],
  calculate: (value) =>
    calculate({
      expressionMajor: value.expressionMajor as number,
      expressionMinor: value.expressionMinor as number,
      methylationMajor: value.methylationMajor as number,
      methylationMinor: value.methylationMinor as number,
      minimumExpressionSkew: value.minimumExpressionSkew as number,
      maximumMethylationSkew: value.maximumMethylationSkew as number,
    }),
});
export const run = tool.execute;
export default tool;
