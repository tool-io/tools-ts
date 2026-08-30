import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly plasmaTemperatureKelvin: number;
  readonly transitionEnergyEv: number;
  readonly measuredElectronDensityCm3: number;
}>;
export type Output = Readonly<{
  readonly minimumElectronDensityCm3: number;
  readonly meetsCriterion: boolean;
}>;

export const calculate = (input: Input): Output => {
  const minimumElectronDensityCm3 =
    1.6e12 *
    Math.sqrt(input.plasmaTemperatureKelvin) *
    input.transitionEnergyEv ** 3;
  return {
    minimumElectronDensityCm3,
    meetsCriterion:
      input.measuredElectronDensityCm3 >= minimumElectronDensityCm3,
  };
};

export const exampleInput = {
  plasmaTemperatureKelvin: 10000,
  transitionEnergyEv: 2,
  measuredElectronDensityCm3: 2000000000000000,
} satisfies Input;
export const exampleOutput = {
  minimumElectronDensityCm3: 1280000000000000,
  meetsCriterion: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      plasmaTemperatureKelvin: input.plasmaTemperatureKelvin as number,
      transitionEnergyEv: input.transitionEnergyEv as number,
      measuredElectronDensityCm3: input.measuredElectronDensityCm3 as number,
    }),
  description:
    "Calculate the McWhirter LTE minimum electron density and compare a measurement.",
  id: "laser/mcwhirter-density-threshold",
  inputs: [
    {
      id: "plasmaTemperatureKelvin",
      label: "Plasma temperature",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
    {
      id: "transitionEnergyEv",
      label: "Transition energy separation",
      kind: "number",
      minimum: 0,
      unit: "eV",
    },
    {
      id: "measuredElectronDensityCm3",
      label: "Measured electron density",
      kind: "number",
      minimum: 0,
      unit: "cm⁻³",
    },
  ],
  outputs: [
    {
      id: "minimumElectronDensityCm3",
      label: "McWhirter minimum density",
      kind: "number",
      minimum: 0,
      unit: "cm⁻³",
    },
    { id: "meetsCriterion", label: "Meets criterion", kind: "boolean" },
  ],
  title: "McWhirter Density Threshold",
});

export const run = tool.execute;
export default tool;
