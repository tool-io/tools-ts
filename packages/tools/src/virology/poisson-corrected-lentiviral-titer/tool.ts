import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, fraction, count } from "../shared.js";

export type Input = Readonly<{
  readonly transducedFraction: number;
  readonly targetCells: number;
  readonly inoculumVolumeMl: number;
  readonly dilutionFraction: number;
}>;
export type Output = Readonly<{
  readonly estimatedMoi: number;
  readonly transducingUnitsPerMl: number;
}>;
export const calculate = (input: Input): Output => {
  fraction(input.transducedFraction, "transducedFraction");
  if (input.transducedFraction === 1)
    simpleError(
      "transducedFraction",
      "Transduced fraction must be less than one.",
    );
  count(input.targetCells, "targetCells", 1);
  positive(input.inoculumVolumeMl, "inoculumVolumeMl");
  fraction(input.dilutionFraction, "dilutionFraction");
  positive(input.dilutionFraction, "dilutionFraction");
  const estimatedMoi = -Math.log1p(-input.transducedFraction);
  return {
    estimatedMoi,
    transducingUnitsPerMl:
      (estimatedMoi * input.targetCells) /
      (input.inoculumVolumeMl * input.dilutionFraction),
  };
};
export const exampleInput = {
  transducedFraction: 0.5,
  targetCells: 1000,
  inoculumVolumeMl: 0.1,
  dilutionFraction: 0.01,
} satisfies Input;
export const exampleOutput = {
  estimatedMoi: 0.6931471805599453,
  transducingUnitsPerMl: 693147.1805599453,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/poisson-corrected-lentiviral-titer",
  title: "Poisson Corrected Lentiviral Titer",
  description:
    "Estimate functional lentiviral titer with Poisson multi-hit correction and explicit assay volume and dilution.",
  inputs: [
    {
      id: "transducedFraction",
      label: "Transduced fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    { id: "targetCells", label: "Target cells", kind: "integer", minimum: 1 },
    { id: "inoculumVolumeMl", label: "Inoculum volume ml", kind: "number" },
    {
      id: "dilutionFraction",
      label: "Dilution fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    { id: "estimatedMoi", label: "Estimated moi", kind: "number" },
    {
      id: "transducingUnitsPerMl",
      label: "Transducing units per ml",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      transducedFraction: value.transducedFraction as number,
      targetCells: value.targetCells as number,
      inoculumVolumeMl: value.inoculumVolumeMl as number,
      dilutionFraction: value.dilutionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
