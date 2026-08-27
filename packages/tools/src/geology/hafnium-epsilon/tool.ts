import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HafniumEpsilonInput = {
  readonly hf176hf177: number;
  readonly churHf176Hf177?: number;
};

export type HafniumEpsilonOutput = {
  readonly epsilonHf: number;
};

const CHUR_176HF_177HF_TODAY = 0.282785;

/**
 * Bouvier et al. (2008) epsilon notation against CHUR:
 * eps(Hf) = ((176Hf/177Hf)_sample / (176Hf/177Hf)_CHUR - 1) * 1e4.
 */
export const calculateHafniumEpsilon = (
  input: HafniumEpsilonInput,
): HafniumEpsilonOutput => {
  const chur = input.churHf176Hf177 ?? CHUR_176HF_177HF_TODAY;
  if (!(input.hf176hf177 > 0))
    return simpleError(
      "hf176hf177",
      "The sample 176Hf/177Hf ratio must be greater than zero.",
      "invalid_ratio",
    );
  if (!(chur > 0))
    return simpleError(
      "churHf176Hf177",
      "The reference 176Hf/177Hf ratio must be greater than zero.",
      "invalid_ratio",
    );
  return { epsilonHf: (input.hf176hf177 / chur - 1) * 1e4 };
};

export const hafniumEpsilonExample = {
  input: { hf176hf177: 0.28325, churHf176Hf177: 0.282785 },
  output: { epsilonHf: 16.443587884789057 },
} satisfies ToolExample<HafniumEpsilonInput, HafniumEpsilonOutput>;

export const hafniumEpsilonTool = createSimpleTool({
  id: "geology/hafnium-epsilon",
  title: "Geology Hafnium Epsilon Calculator",
  description:
    "Express a measured 176Hf/177Hf ratio as epsilon-Hf relative to the chondritic uniform reservoir (CHUR).",
  inputs: [
    {
      description: "Measured present-day 176Hf/177Hf ratio of the sample.",
      id: "hf176hf177",
      kind: "number",
      label: "176Hf/177Hf",
      minimum: 0,
    },
    {
      default: 0.282785,
      description: "Reference CHUR 176Hf/177Hf ratio.",
      id: "churHf176Hf177",
      kind: "number",
      label: "CHUR 176Hf/177Hf",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "epsilon-Hf in parts per ten thousand relative to CHUR.",
      id: "epsilonHf",
      kind: "number",
      label: "epsilon Hf",
    },
  ],
  calculate: (input) =>
    calculateHafniumEpsilon(input as unknown as HafniumEpsilonInput),
});

export const runHafniumEpsilon = hafniumEpsilonTool.execute;
export default hafniumEpsilonTool;
