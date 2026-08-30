import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly correctionDiopters: number;
  readonly micrometersPerDiopter: number;
  readonly cornealThicknessMicrometers: number;
  readonly flapThicknessMicrometers: number;
  readonly minimumResidualBedMicrometers: number;
}>;
export type Output = Readonly<{
  readonly ablationDepthMicrometers: number;
  readonly residualBedMicrometers: number;
  readonly meetsResidualBedMinimum: boolean;
}>;

export const calculate = (input: Input): Output => {
  const ablationDepthMicrometers =
    input.correctionDiopters * input.micrometersPerDiopter;
  const residualBedMicrometers =
    input.cornealThicknessMicrometers -
    input.flapThicknessMicrometers -
    ablationDepthMicrometers;
  return {
    ablationDepthMicrometers,
    residualBedMicrometers,
    meetsResidualBedMinimum:
      residualBedMicrometers >= input.minimumResidualBedMicrometers,
  };
};

export const exampleInput = {
  correctionDiopters: 5,
  micrometersPerDiopter: 10,
  cornealThicknessMicrometers: 500,
  flapThicknessMicrometers: 100,
  minimumResidualBedMicrometers: 300,
} satisfies Input;
export const exampleOutput = {
  ablationDepthMicrometers: 50,
  residualBedMicrometers: 350,
  meetsResidualBedMinimum: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      correctionDiopters: input.correctionDiopters as number,
      micrometersPerDiopter: input.micrometersPerDiopter as number,
      cornealThicknessMicrometers: input.cornealThicknessMicrometers as number,
      flapThicknessMicrometers: input.flapThicknessMicrometers as number,
      minimumResidualBedMicrometers:
        input.minimumResidualBedMicrometers as number,
    }),
  description:
    "Estimate LASIK ablation depth and residual stromal bed using caller-supplied coefficients.",
  id: "laser/lasik-ablation-depth",
  inputs: [
    {
      id: "correctionDiopters",
      label: "Requested refractive correction",
      kind: "number",
      minimum: 0,
      unit: "D",
    },
    {
      id: "micrometersPerDiopter",
      label: "Ablation coefficient",
      kind: "number",
      minimum: 0,
      unit: "µm/D",
    },
    {
      id: "cornealThicknessMicrometers",
      label: "Corneal thickness",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
    {
      id: "flapThicknessMicrometers",
      label: "Flap thickness",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
    {
      id: "minimumResidualBedMicrometers",
      label: "Caller minimum residual bed",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
  ],
  outputs: [
    {
      id: "ablationDepthMicrometers",
      label: "Estimated ablation depth",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
    {
      id: "residualBedMicrometers",
      label: "Estimated residual stromal bed",
      kind: "number",
      unit: "µm",
    },
    {
      id: "meetsResidualBedMinimum",
      label: "Meets supplied residual-bed minimum",
      kind: "boolean",
    },
  ],
  title: "LASIK Ablation Depth",
});

export const run = tool.execute;
export default tool;
