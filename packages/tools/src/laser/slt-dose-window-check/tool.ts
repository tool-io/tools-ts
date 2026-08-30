import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly pulseEnergyMillijoules: number;
  readonly spotDiameterMicrometers: number;
  readonly minimumFluenceJPerCm2: number;
  readonly maximumFluenceJPerCm2: number;
}>;
export type Output = Readonly<{
  readonly fluenceJPerCm2: number;
  readonly nearestBoundaryMarginJPerCm2: number;
  readonly withinWindow: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.spotDiameterMicrometers <= 0 ||
    input.minimumFluenceJPerCm2 > input.maximumFluenceJPerCm2
  )
    simpleError(
      "spotDiameterMicrometers",
      "Spot must be positive and dose bounds ordered.",
      "invalid_window",
    );
  const areaCm2 = Math.PI * ((input.spotDiameterMicrometers * 1e-4) / 2) ** 2;
  const fluenceJPerCm2 = input.pulseEnergyMillijoules / 1000 / areaCm2;
  return {
    fluenceJPerCm2,
    nearestBoundaryMarginJPerCm2: Math.min(
      fluenceJPerCm2 - input.minimumFluenceJPerCm2,
      input.maximumFluenceJPerCm2 - fluenceJPerCm2,
    ),
    withinWindow:
      fluenceJPerCm2 >= input.minimumFluenceJPerCm2 &&
      fluenceJPerCm2 <= input.maximumFluenceJPerCm2,
  };
};

export const exampleInput = {
  pulseEnergyMillijoules: 0.001,
  spotDiameterMicrometers: 100,
  minimumFluenceJPerCm2: 0.01,
  maximumFluenceJPerCm2: 0.02,
} satisfies Input;
export const exampleOutput = {
  fluenceJPerCm2: 0.012732395447351627,
  nearestBoundaryMarginJPerCm2: 0.0027323954473516265,
  withinWindow: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      pulseEnergyMillijoules: input.pulseEnergyMillijoules as number,
      spotDiameterMicrometers: input.spotDiameterMicrometers as number,
      minimumFluenceJPerCm2: input.minimumFluenceJPerCm2 as number,
      maximumFluenceJPerCm2: input.maximumFluenceJPerCm2 as number,
    }),
  description:
    "Calculate SLT pulse fluence and compare it with caller-supplied dose bounds.",
  id: "laser/slt-dose-window-check",
  inputs: [
    {
      id: "pulseEnergyMillijoules",
      label: "Pulse energy",
      kind: "number",
      minimum: 0,
      unit: "mJ",
    },
    {
      id: "spotDiameterMicrometers",
      label: "Spot diameter",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
    {
      id: "minimumFluenceJPerCm2",
      label: "Caller minimum fluence",
      kind: "number",
      minimum: 0,
      unit: "J/cm²",
    },
    {
      id: "maximumFluenceJPerCm2",
      label: "Caller maximum fluence",
      kind: "number",
      minimum: 0,
      unit: "J/cm²",
    },
  ],
  outputs: [
    {
      id: "fluenceJPerCm2",
      label: "Delivered fluence",
      kind: "number",
      minimum: 0,
      unit: "J/cm²",
    },
    {
      id: "nearestBoundaryMarginJPerCm2",
      label: "Nearest dose-window margin",
      kind: "number",
      unit: "J/cm²",
    },
    { id: "withinWindow", label: "Within supplied window", kind: "boolean" },
  ],
  title: "SLT Dose Window Check",
});

export const run = tool.execute;
export default tool;
