import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GeneticDistanceNeiInput = {
  readonly px1: number;
  readonly px2: number;
  readonly py1: number;
  readonly py2: number;
};

export type GeneticDistanceNeiOutput = {
  readonly neiDistance: number;
};

export const geneticDistanceNeiExample = {
  input: { px1: 0.8, px2: 0.2, py1: 0.6, py2: 0.4 },
  output: { neiDistance: 0.060024021143617684 },
} satisfies ToolExample<GeneticDistanceNeiInput, GeneticDistanceNeiOutput>;

const sumToOne = (sum: number): boolean => Math.abs(sum - 1) <= 1e-9;

export const geneticDistanceNeiTool = createSimpleTool({
  id: "biology/genetic-distance-nei",
  title: "Nei Genetic Distance",
  description:
    "Compute Nei's standard genetic distance between two populations at a two-allele locus.",
  inputs: [
    {
      id: "px1",
      label: "Population X allele 1 frequency",
      kind: "number",
      minimum: 0,
    },
    {
      id: "px2",
      label: "Population X allele 2 frequency",
      kind: "number",
      minimum: 0,
    },
    {
      id: "py1",
      label: "Population Y allele 1 frequency",
      kind: "number",
      minimum: 0,
    },
    {
      id: "py2",
      label: "Population Y allele 2 frequency",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [{ id: "neiDistance", label: "Nei distance", kind: "number" }],
  calculate: (input) => {
    const px1 = input.px1 as number;
    const px2 = input.px2 as number;
    const py1 = input.py1 as number;
    const py2 = input.py2 as number;
    if (!sumToOne(px1 + px2))
      simpleError(
        "px1",
        "Population X frequencies must sum to 1.",
        "invalid_frequencies",
      );
    if (!sumToOne(py1 + py2))
      simpleError(
        "py1",
        "Population Y frequencies must sum to 1.",
        "invalid_frequencies",
      );
    const identity = px1 * py1 + px2 * py2;
    const jx = px1 * px1 + px2 * px2;
    const jy = py1 * py1 + py2 * py2;
    const logArgument = identity / Math.sqrt(jx * jy);
    if (!(logArgument > 0))
      simpleError(
        "px1",
        "Populations share no alleles, so Nei distance is undefined.",
        "no_shared_alleles",
      );
    return { neiDistance: -Math.log(logArgument) };
  },
});
export const runGeneticDistanceNei = geneticDistanceNeiTool.execute;
export default geneticDistanceNeiTool;
