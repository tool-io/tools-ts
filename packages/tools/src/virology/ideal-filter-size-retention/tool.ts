import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly virionDiametersNm: readonly number[];
  readonly particleWeights: readonly number[];
  readonly poreDiameterNm: number;
}>;
export type Output = Readonly<{
  readonly idealPassingFraction: number;
  readonly idealRetainedFraction: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.virionDiametersNm, input.particleWeights, "virionDiametersNm");
  input.virionDiametersNm.forEach((v) => positive(v, "virionDiametersNm"));
  input.particleWeights.forEach((v) => nonnegative(v, "particleWeights"));
  positive(input.poreDiameterNm, "poreDiameterNm");
  const total = input.particleWeights.reduce((a, b) => a + b, 0);
  positive(total, "particleWeights");
  const idealPassingFraction =
    input.particleWeights.reduce(
      (sum, v, i) =>
        sum + (input.virionDiametersNm[i] < input.poreDiameterNm ? v : 0),
      0,
    ) / total;
  return {
    idealPassingFraction,
    idealRetainedFraction: 1 - idealPassingFraction,
  };
};
export const exampleInput = {
  virionDiametersNm: [20, 50, 100],
  particleWeights: [1, 2, 1],
  poreDiameterNm: 50,
} satisfies Input;
export const exampleOutput = {
  idealPassingFraction: 0.25,
  idealRetainedFraction: 0.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/ideal-filter-size-retention",
  title: "Ideal Filter Size Retention",
  description:
    "Estimate weighted size-exclusion fractions in an ideal rigid-pore model; actual membrane retention requires validation.",
  inputs: [
    {
      id: "virionDiametersNm",
      label: "Virion diameters nm",
      kind: "numberList",
    },
    { id: "particleWeights", label: "Particle weights", kind: "numberList" },
    { id: "poreDiameterNm", label: "Pore diameter nm", kind: "number" },
  ],
  outputs: [
    {
      id: "idealPassingFraction",
      label: "Ideal passing fraction",
      kind: "number",
    },
    {
      id: "idealRetainedFraction",
      label: "Ideal retained fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      virionDiametersNm: value.virionDiametersNm as readonly number[],
      particleWeights: value.particleWeights as readonly number[],
      poreDiameterNm: value.poreDiameterNm as number,
    }),
});
export const run = tool.execute;
export default tool;
