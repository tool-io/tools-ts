import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  proteinSequence,
  kyteDoolittleHydropathy,
} from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly minutesPerHydropathyUnit: number;
  readonly baseRetentionMinutes: number;
}>;
export type Output = Readonly<{
  readonly meanHydropathy: number;
  readonly retentionProxyMinutes: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    meanHydropathy =
      [...s].reduce((sum, v) => sum + kyteDoolittleHydropathy[v], 0) / s.length;
  return {
    meanHydropathy,
    retentionProxyMinutes:
      input.baseRetentionMinutes +
      meanHydropathy * input.minutesPerHydropathyUnit,
  };
};
export const exampleInput = {
  sequence: "AIL",
  minutesPerHydropathyUnit: 2,
  baseRetentionMinutes: 10,
} satisfies Input;
export const exampleOutput = {
  meanHydropathy: 3.3666666666666667,
  retentionProxyMinutes: 16.733333333333334,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/peptide-hydrophobicity",
  title: "Peptide Hydrophobicity",
  description:
    "Estimate a peptide retention proxy from average hydropathy and caller calibration.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    {
      id: "minutesPerHydropathyUnit",
      label: "Minutes per hydropathy unit",
      kind: "number",
    },
    {
      id: "baseRetentionMinutes",
      label: "Base retention minutes",
      kind: "number",
    },
  ],
  outputs: [
    { id: "meanHydropathy", label: "Mean hydropathy", kind: "number" },
    {
      id: "retentionProxyMinutes",
      label: "Retention proxy minutes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      minutesPerHydropathyUnit: value.minutesPerHydropathyUnit as number,
      baseRetentionMinutes: value.baseRetentionMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
