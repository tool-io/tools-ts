import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly driveToThresholdRatio: number;
  readonly photonLifetimeSeconds: number;
  readonly carrierLifetimeSeconds: number;
}>;
export type Output = Readonly<{
  readonly frequencyHertz: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.driveToThresholdRatio < 1 ||
    input.photonLifetimeSeconds <= 0 ||
    input.carrierLifetimeSeconds <= 0
  )
    simpleError(
      "driveToThresholdRatio",
      "Drive ratio must be at least one and lifetimes positive.",
      "invalid_parameters",
    );
  return {
    frequencyHertz: Math.sqrt(
      (input.driveToThresholdRatio - 1) /
        (4 *
          Math.PI ** 2 *
          input.photonLifetimeSeconds *
          input.carrierLifetimeSeconds),
    ),
  };
};

export const exampleInput = {
  driveToThresholdRatio: 2,
  photonLifetimeSeconds: 1e-12,
  carrierLifetimeSeconds: 1e-9,
} satisfies Input;
export const exampleOutput = {
  frequencyHertz: 5032921210.448704,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      driveToThresholdRatio: input.driveToThresholdRatio as number,
      photonLifetimeSeconds: input.photonLifetimeSeconds as number,
      carrierLifetimeSeconds: input.carrierLifetimeSeconds as number,
    }),
  description:
    "Estimate relaxation-oscillation frequency from normalized drive and photon and carrier lifetimes.",
  id: "laser/relaxation-oscillation-frequency",
  inputs: [
    {
      id: "driveToThresholdRatio",
      label: "Drive-to-threshold ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "photonLifetimeSeconds",
      label: "Photon lifetime",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "carrierLifetimeSeconds",
      label: "Carrier lifetime",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      id: "frequencyHertz",
      label: "Relaxation-oscillation frequency",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
  ],
  title: "Relaxation-Oscillation Frequency",
});

export const run = tool.execute;
export default tool;
