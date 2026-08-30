import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly centerPositionsBp: readonly number[];
  readonly maximumStdDevBp: number;
}>;
export type Output = Readonly<{
  readonly meanCenterBp: number;
  readonly positionStdDevBp: number;
  readonly call: string;
}>;

export const calculate = (input: Input): Output => {
  if (input.centerPositionsBp.length === 0)
    simpleError(
      "centerPositionsBp",
      "At least one center is required.",
      "empty_centers",
    );
  const meanCenterBp =
      input.centerPositionsBp.reduce((a, b) => a + b, 0) /
      input.centerPositionsBp.length,
    positionStdDevBp = Math.sqrt(
      input.centerPositionsBp.reduce(
        (sum, v) => sum + (v - meanCenterBp) ** 2,
        0,
      ) / input.centerPositionsBp.length,
    );
  return {
    meanCenterBp,
    positionStdDevBp,
    call:
      positionStdDevBp <= input.maximumStdDevBp ? "well-positioned" : "fuzzy",
  };
};

export const exampleInput = {
  centerPositionsBp: [99, 100, 101],
  maximumStdDevBp: 1,
} satisfies Input;
export const exampleOutput = {
  meanCenterBp: 100,
  positionStdDevBp: 0.816496580927726,
  call: "well-positioned",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      centerPositionsBp: input.centerPositionsBp as readonly number[],
      maximumStdDevBp: input.maximumStdDevBp as number,
    }),
  description: "Classify nucleosome positioning from center dispersion.",
  id: "epigenetics/nucleosome-positioning",
  inputs: [
    {
      id: "centerPositionsBp",
      label: "Nucleosome centers",
      kind: "numberList",
    },
    {
      id: "maximumStdDevBp",
      label: "Maximum standard deviation",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "meanCenterBp", label: "Mean center", kind: "number" },
    {
      id: "positionStdDevBp",
      label: "Position standard deviation",
      kind: "number",
      minimum: 0,
    },
    {
      id: "call",
      label: "Positioning call",
      kind: "string",
      enum: ["well-positioned", "fuzzy"],
    },
  ],
  title: "Nucleosome Positioning",
});

export const run = tool.execute;
export default tool;
