import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SeismicStackVelocityInput = {
  readonly zeroOffsetTimeS: number;
  readonly offsetM: number;
  readonly timeAtOffsetS: number;
};

export type SeismicStackVelocityOutput = {
  readonly stackVelocityMPers: number;
};

export const calculateSeismicStackVelocity = (
  input: SeismicStackVelocityInput,
): SeismicStackVelocityOutput => {
  if (!(input.zeroOffsetTimeS > 0))
    return simpleError(
      "zeroOffsetTimeS",
      "Zero-offset time must be greater than zero.",
      "invalid_time",
    );
  if (!(input.offsetM > 0))
    return simpleError(
      "offsetM",
      "Offset must be greater than zero to constrain the hyperbola.",
      "invalid_offset",
    );
  if (!(input.timeAtOffsetS > input.zeroOffsetTimeS))
    return simpleError(
      "timeAtOffsetS",
      "The arrival time at offset must exceed the zero-offset time.",
      "invalid_time",
    );
  return {
    stackVelocityMPers:
      input.offsetM /
      Math.sqrt(input.timeAtOffsetS ** 2 - input.zeroOffsetTimeS ** 2),
  };
};

export const seismicStackVelocityExample = {
  input: { zeroOffsetTimeS: 1.0, offsetM: 2000, timeAtOffsetS: 1.5 },
  output: { stackVelocityMPers: 1788.8543819998317 },
} satisfies ToolExample<SeismicStackVelocityInput, SeismicStackVelocityOutput>;

export const seismicStackVelocityTool = createSimpleTool({
  id: "geology/seismic-stack-velocity",
  title: "Seismic Stack Velocity Calculator",
  description:
    "Invert the normal-moveout hyperbola t(x)^2 = t0^2 + x^2/Vstk^2 for the stacking velocity in meters per second, given a zero-offset time in seconds and an observed arrival time in seconds at a source-receiver offset in meters.",
  inputs: [
    {
      description: "Zero-offset two-way time t0 in seconds.",
      id: "zeroOffsetTimeS",
      kind: "number",
      label: "t0",
    },
    {
      description: "Source-receiver offset x in meters.",
      id: "offsetM",
      kind: "number",
      label: "x",
      minimum: 0,
    },
    {
      description: "Observed arrival time t(x) at that offset in seconds.",
      id: "timeAtOffsetS",
      kind: "number",
      label: "t(x)",
    },
  ],
  outputs: [
    {
      description: "Stacking velocity in meters per second.",
      id: "stackVelocityMPers",
      kind: "number",
      label: "V stk",
    },
  ],
  calculate: (input) =>
    calculateSeismicStackVelocity(
      input as unknown as SeismicStackVelocityInput,
    ),
});

export const runSeismicStackVelocity = seismicStackVelocityTool.execute;
export default seismicStackVelocityTool;
