import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sizeStandardDeviationNanometers: number;
  readonly energySensitivityEvPerNanometer: number;
}>;
export type Output = Readonly<{
  readonly energySigmaEv: number;
  readonly energyFwhmEv: number;
}>;

export const calculate = (input: Input): Output => {
  const energySigmaEv = Math.abs(
    input.sizeStandardDeviationNanometers *
      input.energySensitivityEvPerNanometer,
  );
  return {
    energySigmaEv,
    energyFwhmEv: 2 * Math.sqrt(2 * Math.log(2)) * energySigmaEv,
  };
};

export const exampleInput = {
  sizeStandardDeviationNanometers: 1,
  energySensitivityEvPerNanometer: 1,
} satisfies Input;
export const exampleOutput = {
  energySigmaEv: 1,
  energyFwhmEv: 2.3548200450309493,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      sizeStandardDeviationNanometers:
        input.sizeStandardDeviationNanometers as number,
      energySensitivityEvPerNanometer:
        input.energySensitivityEvPerNanometer as number,
    }),
  description:
    "Propagate quantum-dot size dispersion into Gaussian transition-energy broadening.",
  id: "laser/qd-inhomogeneous-broadening",
  inputs: [
    {
      id: "sizeStandardDeviationNanometers",
      label: "QD size standard deviation",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "energySensitivityEvPerNanometer",
      label: "Transition-energy size sensitivity",
      kind: "number",
      unit: "eV/nm",
    },
  ],
  outputs: [
    {
      id: "energySigmaEv",
      label: "Energy standard deviation",
      kind: "number",
      minimum: 0,
      unit: "eV",
    },
    {
      id: "energyFwhmEv",
      label: "Gaussian inhomogeneous FWHM",
      kind: "number",
      minimum: 0,
      unit: "eV",
    },
  ],
  title: "QD Inhomogeneous Broadening",
});

export const run = tool.execute;
export default tool;
