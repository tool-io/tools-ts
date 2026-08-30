import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly biasVoltageVolts: number;
  readonly electrodeGapMeters: number;
}>;
export type Output = Readonly<{
  readonly electricFieldVoltsPerMeter: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.electrodeGapMeters <= 0)
    simpleError(
      "electrodeGapMeters",
      "Electrode gap must be positive.",
      "invalid_gap",
    );
  return {
    electricFieldVoltsPerMeter:
      input.biasVoltageVolts / input.electrodeGapMeters,
  };
};

export const exampleInput = {
  biasVoltageVolts: 100,
  electrodeGapMeters: 0.001,
} satisfies Input;
export const exampleOutput = {
  electricFieldVoltsPerMeter: 100000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      biasVoltageVolts: input.biasVoltageVolts as number,
      electrodeGapMeters: input.electrodeGapMeters as number,
    }),
  description:
    "Calculate photoconductive-antenna bias field across the electrode gap.",
  id: "laser/photoconductive-antenna-field",
  inputs: [
    {
      id: "biasVoltageVolts",
      label: "Bias voltage",
      kind: "number",
      unit: "V",
    },
    {
      id: "electrodeGapMeters",
      label: "Electrode gap",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "electricFieldVoltsPerMeter",
      label: "Gap electric field",
      kind: "number",
      unit: "V/m",
    },
  ],
  title: "Photoconductive-Antenna Field",
});

export const run = tool.execute;
export default tool;
