import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PoreDensityCounterInput = {
  readonly fieldAreaMm2: number;
  readonly poreCountInFieldInt: number;
};

export type PoreDensityCounterOutput = {
  readonly poresPerMm2: number;
};

export const poreDensityCounterExample = {
  input: { fieldAreaMm2: 4, poreCountInFieldInt: 30 },
  output: { poresPerMm2: 7.5 },
} satisfies ToolExample<PoreDensityCounterInput, PoreDensityCounterOutput>;

export const poreDensityCounterTool = createSimpleTool({
  id: "mycology/pore-density-counter",
  title: "Pore Density Calculator",
  description:
    "Compute pores per square millimetre from a counted field of known area.",
  inputs: [
    {
      id: "fieldAreaMm2",
      kind: "number",
      label: "Field area",
      minimum: Number.MIN_VALUE,
      unit: "mm²",
    },
    {
      id: "poreCountInFieldInt",
      kind: "integer",
      label: "Pores in field",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "poresPerMm2",
      kind: "number",
      label: "Pores per mm²",
      unit: "pores/mm²",
    },
  ],
  calculate: (input) => {
    const { fieldAreaMm2, poreCountInFieldInt } =
      input as unknown as PoreDensityCounterInput;
    if (!(fieldAreaMm2 > 0))
      simpleError("fieldAreaMm2", "Field area must be greater than zero.");
    return { poresPerMm2: poreCountInFieldInt / fieldAreaMm2 };
  },
});
export const runPoreDensityCounter = poreDensityCounterTool.execute;
export default poreDensityCounterTool;
