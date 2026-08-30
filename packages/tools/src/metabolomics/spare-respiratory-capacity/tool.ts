import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly maximalOcr: number;
  readonly basalOcr: number;
  readonly nonMitoOcr: number;
}>;
export type Output = Readonly<{
  readonly spareOcr: number;
  readonly spareCapacityPercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.basalOcr <= input.nonMitoOcr || input.maximalOcr < input.nonMitoOcr)
    simpleError("basalOcr", "Valid positive mitochondrial OCR rates required.");
  const spareOcr = input.maximalOcr - input.basalOcr;
  return {
    spareOcr,
    spareCapacityPercent:
      (spareOcr / (input.basalOcr - input.nonMitoOcr)) * 100,
  };
};
export const exampleInput = {
  maximalOcr: 160,
  basalOcr: 100,
  nonMitoOcr: 20,
} satisfies Input;
export const exampleOutput = {
  spareOcr: 60,
  spareCapacityPercent: 75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/spare-respiratory-capacity",
  title: "Spare Respiratory Capacity",
  description:
    "Measure spare respiratory capacity relative to corrected basal OCR.",
  inputs: [
    { id: "maximalOcr", kind: "number", label: "Maximal ocr" },
    { id: "basalOcr", kind: "number", label: "Basal ocr" },
    { id: "nonMitoOcr", kind: "number", label: "Non mito ocr" },
  ],
  outputs: [
    { id: "spareOcr", kind: "number", label: "Spare ocr" },
    {
      id: "spareCapacityPercent",
      kind: "number",
      label: "Spare capacity percent",
    },
  ],
  calculate: (value) =>
    calculate({
      maximalOcr: value.maximalOcr as number,
      basalOcr: value.basalOcr as number,
      nonMitoOcr: value.nonMitoOcr as number,
    }),
});
export const run = tool.execute;
export default tool;
