import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly intrinsicClearanceMicrolitersPerMinuteMillionCells: number;
  readonly hepatocellularityMillionCellsPerGram: number;
  readonly liverGramsPerKg: number;
  readonly bodyMassKg: number;
  readonly unboundBloodFraction: number;
  readonly hepaticBloodFlowMlPerMinute: number;
}>;
export type Output = Readonly<{
  readonly scaledIntrinsicClearanceMlPerMinute: number;
  readonly hepaticClearanceMlPerMinute: number;
  readonly hepaticExtractionFraction: number;
}>;
const inputFields = [
  {
    id: "intrinsicClearanceMicrolitersPerMinuteMillionCells",
    label: "Intrinsic clearance microliters per minute million cells",
    kind: "number",
  },
  {
    id: "hepatocellularityMillionCellsPerGram",
    label: "Hepatocellularity million cells per gram",
    kind: "number",
  },
  {
    id: "liverGramsPerKg",
    label: "Liver grams per kg",
    kind: "number",
    unit: "kg",
  },
  { id: "bodyMassKg", label: "Body mass kg", kind: "number", unit: "kg" },
  {
    id: "unboundBloodFraction",
    label: "Unbound blood fraction",
    kind: "number",
  },
  {
    id: "hepaticBloodFlowMlPerMinute",
    label: "Hepatic blood flow ml per minute",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.intrinsicClearanceMicrolitersPerMinuteMillionCells,
    "intrinsicClearanceMicrolitersPerMinuteMillionCells",
  );
  positive(
    input.hepatocellularityMillionCellsPerGram,
    "hepatocellularityMillionCellsPerGram",
  );
  positive(input.liverGramsPerKg, "liverGramsPerKg");
  positive(input.bodyMassKg, "bodyMassKg");
  fraction(input.unboundBloodFraction, "unboundBloodFraction");
  positive(input.hepaticBloodFlowMlPerMinute, "hepaticBloodFlowMlPerMinute");
  const scaledIntrinsicClearanceMlPerMinute =
      (input.intrinsicClearanceMicrolitersPerMinuteMillionCells *
        input.hepatocellularityMillionCellsPerGram *
        input.liverGramsPerKg *
        input.bodyMassKg) /
      1000,
    unbound = input.unboundBloodFraction * scaledIntrinsicClearanceMlPerMinute,
    hepaticExtractionFraction =
      unbound / (input.hepaticBloodFlowMlPerMinute + unbound);
  return {
    scaledIntrinsicClearanceMlPerMinute,
    hepaticClearanceMlPerMinute:
      input.hepaticBloodFlowMlPerMinute * hepaticExtractionFraction,
    hepaticExtractionFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  intrinsicClearanceMicrolitersPerMinuteMillionCells: 10,
  hepatocellularityMillionCellsPerGram: 100,
  liverGramsPerKg: 20,
  bodyMassKg: 1,
  unboundBloodFraction: 0.5,
  hepaticBloodFlowMlPerMinute: 60,
} satisfies Input;
export const exampleOutput = {
  scaledIntrinsicClearanceMlPerMinute: 20,
  hepaticClearanceMlPerMinute: 8.571428571428571,
  hepaticExtractionFraction: 0.14285714285714285,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/well-stirred-hepatic-ivive-clearance",
  title: "IVIVE Extrapolation",
  description:
    "Scale hepatocyte intrinsic clearance to a supplied liver size and apply the well-stirred hepatic model; binding, blood/plasma partition and physiological parameters must be externally calibrated.",
  inputs: inputFields,
  outputs: [
    {
      id: "scaledIntrinsicClearanceMlPerMinute",
      label: "Scaled intrinsic clearance ml per minute",
      kind: "number",
    },
    {
      id: "hepaticClearanceMlPerMinute",
      label: "Hepatic clearance ml per minute",
      kind: "number",
    },
    {
      id: "hepaticExtractionFraction",
      label: "Hepatic extraction fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      intrinsicClearanceMicrolitersPerMinuteMillionCells:
        value.intrinsicClearanceMicrolitersPerMinuteMillionCells as number,
      hepatocellularityMillionCellsPerGram:
        value.hepatocellularityMillionCellsPerGram as number,
      liverGramsPerKg: value.liverGramsPerKg as number,
      bodyMassKg: value.bodyMassKg as number,
      unboundBloodFraction: value.unboundBloodFraction as number,
      hepaticBloodFlowMlPerMinute: value.hepaticBloodFlowMlPerMinute as number,
    }),
});
export const run = tool.execute;
export default tool;
