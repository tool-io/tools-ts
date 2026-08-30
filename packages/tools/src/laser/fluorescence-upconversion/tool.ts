import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly measuredCrossCorrelationFemtoseconds: number;
  readonly gatePulseWidthFemtoseconds: number;
}>;
export type Output = Readonly<{
  readonly deconvolvedFluorescenceWidthFemtoseconds: number;
  readonly resolvable: boolean;
}>;

export const calculate = (input: Input): Output => {
  const varianceDifference =
    input.measuredCrossCorrelationFemtoseconds ** 2 -
    input.gatePulseWidthFemtoseconds ** 2;
  return {
    deconvolvedFluorescenceWidthFemtoseconds: Math.sqrt(
      Math.max(0, varianceDifference),
    ),
    resolvable: varianceDifference > 0,
  };
};

export const exampleInput = {
  measuredCrossCorrelationFemtoseconds: 500,
  gatePulseWidthFemtoseconds: 300,
} satisfies Input;
export const exampleOutput = {
  deconvolvedFluorescenceWidthFemtoseconds: 400,
  resolvable: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      measuredCrossCorrelationFemtoseconds:
        input.measuredCrossCorrelationFemtoseconds as number,
      gatePulseWidthFemtoseconds: input.gatePulseWidthFemtoseconds as number,
    }),
  description:
    "Gaussian-deconvolve gate width from a fluorescence-upconversion cross-correlation.",
  id: "laser/fluorescence-upconversion",
  inputs: [
    {
      id: "measuredCrossCorrelationFemtoseconds",
      label: "Measured upconversion width",
      kind: "number",
      minimum: 0,
      unit: "fs",
    },
    {
      id: "gatePulseWidthFemtoseconds",
      label: "Gate pulse width",
      kind: "number",
      minimum: 0,
      unit: "fs",
    },
  ],
  outputs: [
    {
      id: "deconvolvedFluorescenceWidthFemtoseconds",
      label: "Deconvolved fluorescence width",
      kind: "number",
      minimum: 0,
      unit: "fs",
    },
    {
      id: "resolvable",
      label: "Measured width exceeds gate width",
      kind: "boolean",
    },
  ],
  title: "Fluorescence Upconversion",
});

export const run = tool.execute;
export default tool;
