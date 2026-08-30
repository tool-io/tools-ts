import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  proteinSequence,
  kyteDoolittleHydropathy,
} from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly nRegionLength: number;
  readonly coreWindowLength: number;
  readonly minimumCoreHydropathy: number;
}>;
export type Output = Readonly<{
  readonly coreStart: number;
  readonly coreMeanHydropathy: number;
  readonly positiveNRegion: boolean;
  readonly candidate: boolean;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  if (
    !Number.isSafeInteger(input.nRegionLength) ||
    input.nRegionLength < 1 ||
    !Number.isSafeInteger(input.coreWindowLength) ||
    input.coreWindowLength < 1 ||
    input.nRegionLength + input.coreWindowLength > s.length
  )
    simpleError(
      "coreWindowLength",
      "N-region and hydrophobic core must fit in the sequence.",
    );
  const positiveNRegion = [...s.slice(0, input.nRegionLength)].some((v) =>
      "KR".includes(v),
    ),
    coreStart = input.nRegionLength,
    coreMeanHydropathy =
      [...s.slice(coreStart, coreStart + input.coreWindowLength)].reduce(
        (sum, v) => sum + kyteDoolittleHydropathy[v],
        0,
      ) / input.coreWindowLength;
  return {
    coreStart,
    coreMeanHydropathy,
    positiveNRegion,
    candidate:
      positiveNRegion && coreMeanHydropathy >= input.minimumCoreHydropathy,
  };
};
export const exampleInput = {
  sequence: "KKAAAAAA",
  nRegionLength: 2,
  coreWindowLength: 4,
  minimumCoreHydropathy: 1.5,
} satisfies Input;
export const exampleOutput = {
  coreStart: 2,
  coreMeanHydropathy: 1.8,
  positiveNRegion: true,
  candidate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/signal-peptide-core-scan",
  title: "Signal Peptide Core Scan",
  description: "Summarize N-region charge and hydrophobic signal-peptide core.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "nRegionLength", label: "N region length", kind: "number" },
    { id: "coreWindowLength", label: "Core window length", kind: "number" },
    {
      id: "minimumCoreHydropathy",
      label: "Minimum core hydropathy",
      kind: "number",
    },
  ],
  outputs: [
    { id: "coreStart", label: "Core start", kind: "number" },
    { id: "coreMeanHydropathy", label: "Core mean hydropathy", kind: "number" },
    { id: "positiveNRegion", label: "Positive n region", kind: "boolean" },
    { id: "candidate", label: "Candidate", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      nRegionLength: value.nRegionLength as number,
      coreWindowLength: value.coreWindowLength as number,
      minimumCoreHydropathy: value.minimumCoreHydropathy as number,
    }),
});
export const run = tool.execute;
export default tool;
