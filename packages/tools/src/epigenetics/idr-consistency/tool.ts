import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly idrValues: readonly number[];
  readonly maximumIdr: number;
  readonly minimumPassingPercent: number;
}>;
export type Output = Readonly<{
  readonly passingCount: number;
  readonly passingPercent: number;
  readonly consistent: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.idrValues.length === 0 ||
    input.idrValues.some((v) => v < 0 || v > 1)
  )
    simpleError(
      "idrValues",
      "IDR values must be nonempty and between zero and one.",
      "invalid_idr",
    );
  const passingCount = input.idrValues.filter(
      (v) => v <= input.maximumIdr,
    ).length,
    passingPercent = (passingCount / input.idrValues.length) * 100;
  return {
    passingCount,
    passingPercent,
    consistent: passingPercent >= input.minimumPassingPercent,
  };
};

export const exampleInput = {
  idrValues: [0.01, 0.02, 0.2, 0.03],
  maximumIdr: 0.05,
  minimumPassingPercent: 70,
} satisfies Input;
export const exampleOutput = {
  passingCount: 3,
  passingPercent: 75,
  consistent: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      idrValues: input.idrValues as readonly number[],
      maximumIdr: input.maximumIdr as number,
      minimumPassingPercent: input.minimumPassingPercent as number,
    }),
  description: "Check replicate consistency from IDR values.",
  id: "epigenetics/idr-consistency",
  inputs: [
    {
      id: "idrValues",
      label: "Irreproducible discovery rates",
      kind: "numberList",
    },
    {
      id: "maximumIdr",
      label: "Maximum passing IDR",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "minimumPassingPercent",
      label: "Minimum passing share",
      kind: "number",
      minimum: 0,
      maximum: 100,
    },
  ],
  outputs: [
    {
      id: "passingCount",
      label: "Passing discoveries",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "passingPercent",
      label: "Passing discovery share",
      kind: "number",
      minimum: 0,
      maximum: 100,
    },
    {
      id: "consistent",
      label: "Meets supplied consistency threshold",
      kind: "boolean",
    },
  ],
  title: "IDR Consistency",
});

export const run = tool.execute;
export default tool;
