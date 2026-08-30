import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly rawBarcodeReads: number;
  readonly uniqueMolecules: number;
}>;
export type Output = Readonly<{
  readonly duplicateReadsCollapsed: number;
  readonly collapseRatePercent: number;
  readonly readsPerMolecule: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.rawBarcodeReads <= 0 ||
    input.uniqueMolecules <= 0 ||
    input.uniqueMolecules > input.rawBarcodeReads
  )
    simpleError(
      "rawBarcodeReads",
      "Raw reads must be positive and at least unique molecules.",
      "invalid_counts",
    );
  return {
    duplicateReadsCollapsed: input.rawBarcodeReads - input.uniqueMolecules,
    collapseRatePercent:
      ((input.rawBarcodeReads - input.uniqueMolecules) /
        input.rawBarcodeReads) *
      100,
    readsPerMolecule: input.rawBarcodeReads / input.uniqueMolecules,
  };
};

export const exampleInput = {
  rawBarcodeReads: 1000,
  uniqueMolecules: 400,
} satisfies Input;
export const exampleOutput = {
  duplicateReadsCollapsed: 600,
  collapseRatePercent: 60,
  readsPerMolecule: 2.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      rawBarcodeReads: input.rawBarcodeReads as number,
      uniqueMolecules: input.uniqueMolecules as number,
    }),
  description: "Calculate UMI duplicate collapse rate and reads per molecule.",
  id: "epigenetics/umi-collapse-rate",
  inputs: [
    {
      id: "rawBarcodeReads",
      label: "Raw barcoded reads",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "uniqueMolecules",
      label: "Unique molecules after UMI collapse",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "duplicateReadsCollapsed",
      label: "Reads collapsed as duplicates",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "collapseRatePercent",
      label: "UMI collapse rate",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "readsPerMolecule",
      label: "Raw reads per molecule",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "UMI Collapse Rate",
});

export const run = tool.execute;
export default tool;
