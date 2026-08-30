import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly preExtractionSpikeArea: number;
  readonly neatStandardArea: number;
}>;
export type Output = Readonly<{
  readonly processEfficiencyPercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.preExtractionSpikeArea < 0 || input.neatStandardArea <= 0)
    simpleError("neatStandardArea", "Neat standard area must be positive.");
  return {
    processEfficiencyPercent:
      (input.preExtractionSpikeArea / input.neatStandardArea) * 100,
  };
};
export const exampleInput = {
  preExtractionSpikeArea: 80,
  neatStandardArea: 100,
} satisfies Input;
export const exampleOutput = { processEfficiencyPercent: 80 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/process-efficiency",
  title: "Process Efficiency",
  description:
    "Measure total analytical process efficiency relative to a neat standard.",
  inputs: [
    {
      id: "preExtractionSpikeArea",
      kind: "number",
      label: "Pre extraction spike area",
    },
    { id: "neatStandardArea", kind: "number", label: "Neat standard area" },
  ],
  outputs: [
    {
      id: "processEfficiencyPercent",
      kind: "number",
      label: "Process efficiency percent",
    },
  ],
  calculate: (value) =>
    calculate({
      preExtractionSpikeArea: value.preExtractionSpikeArea as number,
      neatStandardArea: value.neatStandardArea as number,
    }),
});
export const run = tool.execute;
export default tool;
