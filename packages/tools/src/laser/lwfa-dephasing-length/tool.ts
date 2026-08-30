import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly plasmaWavelengthMeters: number;
  readonly laserWavelengthMeters: number;
}>;
export type Output = Readonly<{
  readonly dephasingLengthMeters: number;
  readonly dephasingCycles: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.laserWavelengthMeters <= 0 || input.plasmaWavelengthMeters <= 0)
    simpleError(
      "laserWavelengthMeters",
      "Wavelengths must be positive.",
      "invalid_wavelength",
    );
  const dephasingLengthMeters =
    input.plasmaWavelengthMeters ** 3 / (2 * input.laserWavelengthMeters ** 2);
  return {
    dephasingLengthMeters,
    dephasingCycles: dephasingLengthMeters / input.plasmaWavelengthMeters,
  };
};

export const exampleInput = {
  plasmaWavelengthMeters: 2,
  laserWavelengthMeters: 1,
} satisfies Input;
export const exampleOutput = {
  dephasingLengthMeters: 4,
  dephasingCycles: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      plasmaWavelengthMeters: input.plasmaWavelengthMeters as number,
      laserWavelengthMeters: input.laserWavelengthMeters as number,
    }),
  description:
    "Estimate LWFA dephasing length from plasma and laser wavelengths.",
  id: "laser/lwfa-dephasing-length",
  inputs: [
    {
      id: "plasmaWavelengthMeters",
      label: "Plasma wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "laserWavelengthMeters",
      label: "Laser wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "dephasingLengthMeters",
      label: "Estimated dephasing length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "dephasingCycles",
      label: "Dephasing length in plasma wavelengths",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "LWFA Dephasing Length",
});

export const run = tool.execute;
export default tool;
