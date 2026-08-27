import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DissipationFactorInput = {
  readonly esrOhms: number;
  readonly xcOhms: number;
};

export type DissipationFactorOutput = {
  readonly dissipationFactor: number;
};

export const dissipationFactorExample = {
  input: { esrOhms: 1, xcOhms: 100 },
  output: { dissipationFactor: 0.01 },
} satisfies ToolExample<DissipationFactorInput, DissipationFactorOutput>;

export const calculateDissipationFactor = (
  input: DissipationFactorInput,
): DissipationFactorOutput => {
  if (input.xcOhms === 0)
    simpleError("xcOhms", "Reactance must not be zero.", "must_be_nonzero");
  return { dissipationFactor: input.esrOhms / input.xcOhms };
};

export const dissipationFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateDissipationFactor(input as unknown as DissipationFactorInput),
  description:
    "Compute the dissipation factor of a capacitor as ESR divided by reactance.",
  id: "electronics/dissipation-factor",
  inputs: [
    {
      description: "Series resistance modeling the losses.",
      format: "resistance",
      id: "esrOhms",
      kind: "number",
      label: "ESR",
      unit: "Ω",
    },
    {
      description: "Reactance of the capacitor at the operating frequency.",
      format: "resistance",
      id: "xcOhms",
      kind: "number",
      label: "Reactance",
      unit: "Ω",
    },
  ],
  outputs: [
    {
      description: "Dissipation factor, the reciprocal of the quality factor.",
      format: "factor",
      id: "dissipationFactor",
      kind: "number",
      label: "Dissipation factor",
    },
  ],
  title: "Dissipation Factor",
});
export const runDissipationFactor = dissipationFactorTool.execute;
export default dissipationFactorTool;
