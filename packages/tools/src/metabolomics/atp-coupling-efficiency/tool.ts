import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly basalOcr: number;
  readonly oligomycinOcr: number;
  readonly nonMitoOcr: number;
}>;
export type Output = Readonly<{
  readonly atpLinkedOcr: number;
  readonly couplingEfficiencyPercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.basalOcr <= input.nonMitoOcr ||
    input.oligomycinOcr < input.nonMitoOcr ||
    input.oligomycinOcr > input.basalOcr
  )
    simpleError(
      "basalOcr",
      "OCR rates must satisfy basal ≥ oligomycin ≥ non-mito.",
    );
  const atpLinkedOcr = input.basalOcr - input.oligomycinOcr;
  return {
    atpLinkedOcr,
    couplingEfficiencyPercent:
      (atpLinkedOcr / (input.basalOcr - input.nonMitoOcr)) * 100,
  };
};
export const exampleInput = {
  basalOcr: 100,
  oligomycinOcr: 40,
  nonMitoOcr: 20,
} satisfies Input;
export const exampleOutput = {
  atpLinkedOcr: 60,
  couplingEfficiencyPercent: 75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/atp-coupling-efficiency",
  title: "ATP Coupling Efficiency",
  description:
    "Calculate ATP-linked oxygen consumption and mitochondrial coupling efficiency.",
  inputs: [
    { id: "basalOcr", kind: "number", label: "Basal ocr" },
    { id: "oligomycinOcr", kind: "number", label: "Oligomycin ocr" },
    { id: "nonMitoOcr", kind: "number", label: "Non mito ocr" },
  ],
  outputs: [
    { id: "atpLinkedOcr", kind: "number", label: "Atp linked ocr" },
    {
      id: "couplingEfficiencyPercent",
      kind: "number",
      label: "Coupling efficiency percent",
    },
  ],
  calculate: (value) =>
    calculate({
      basalOcr: value.basalOcr as number,
      oligomycinOcr: value.oligomycinOcr as number,
      nonMitoOcr: value.nonMitoOcr as number,
    }),
});
export const run = tool.execute;
export default tool;
