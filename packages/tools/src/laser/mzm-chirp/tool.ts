import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly phaseModulationRadians: number;
  readonly fractionalPowerModulation: number;
}>;
export type Output = Readonly<{
  readonly fractionalFieldModulation: number;
  readonly chirpParameter: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.fractionalPowerModulation === 0)
    simpleError(
      "fractionalPowerModulation",
      "Power modulation must not be zero.",
      "invalid_modulation",
    );
  const fractionalFieldModulation = input.fractionalPowerModulation / 2;
  return {
    fractionalFieldModulation,
    chirpParameter: input.phaseModulationRadians / fractionalFieldModulation,
  };
};

export const exampleInput = {
  phaseModulationRadians: 0.1,
  fractionalPowerModulation: 0.2,
} satisfies Input;
export const exampleOutput = {
  fractionalFieldModulation: 0.1,
  chirpParameter: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      phaseModulationRadians: input.phaseModulationRadians as number,
      fractionalPowerModulation: input.fractionalPowerModulation as number,
    }),
  description:
    "Estimate Mach–Zehnder modulator chirp from phase and power modulation.",
  id: "laser/mzm-chirp",
  inputs: [
    {
      id: "phaseModulationRadians",
      label: "Measured phase modulation",
      kind: "number",
      unit: "rad",
    },
    {
      id: "fractionalPowerModulation",
      label: "Fractional optical-power modulation",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "fractionalFieldModulation",
      label: "Fractional field-amplitude modulation",
      kind: "number",
    },
    { id: "chirpParameter", label: "MZM chirp parameter", kind: "number" },
  ],
  title: "MZM Chirp",
});

export const run = tool.execute;
export default tool;
