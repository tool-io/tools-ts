import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PhenylToTyrosineInput = {
  readonly phenylalanineUmolL: number;
  readonly tyrosineUmolL: number;
};

export type PhenylToTyrosineOutput = {
  readonly phenylTyrosineRatio: number;
};

export const phenylToTyrosineExample = {
  input: { phenylalanineUmolL: 60, tyrosineUmolL: 50 },
  output: { phenylTyrosineRatio: 1.2 },
} satisfies ToolExample<PhenylToTyrosineInput, PhenylToTyrosineOutput>;

export const phenylToTyrosineTool = createSimpleTool({
  id: "biology/corrected-phenyl-to-tyrosine",
  title: "Phenyl Tyrosine Ratio",
  description:
    "Compute the phenylalanine to tyrosine concentration ratio in micromoles per litre.",
  inputs: [
    {
      id: "phenylalanineUmolL",
      kind: "number",
      label: "Phenylalanine",
      minimum: 0,
      unit: "umol/L",
    },
    {
      id: "tyrosineUmolL",
      kind: "number",
      label: "Tyrosine",
      minimum: Number.MIN_VALUE,
      unit: "umol/L",
    },
  ],
  outputs: [
    {
      id: "phenylTyrosineRatio",
      kind: "number",
      label: "Phenylalanine to tyrosine ratio",
    },
  ],
  calculate: (input) => ({
    phenylTyrosineRatio:
      (input.phenylalanineUmolL as number) / (input.tyrosineUmolL as number),
  }),
});
export const runPhenylToTyrosine = phenylToTyrosineTool.execute;
export default phenylToTyrosineTool;
