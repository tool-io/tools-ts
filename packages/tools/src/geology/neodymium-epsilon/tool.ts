import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NeodymiumEpsilonInput = {
  readonly nd143nd144: number;
  readonly churNd143nd144?: number;
};

export type NeodymiumEpsilonOutput = {
  readonly epsilonNd: number;
};

const CHUR_143ND_144ND_TODAY = 0.512638;

/**
 * Jacobsen & Wasserburg (1980) epsilon notation against CHUR:
 * eps(Nd) = ((143Nd/144Nd)_sample / (143Nd/144Nd)_CHUR - 1) * 1e4.
 */
export const calculateNeodymiumEpsilon = (
  input: NeodymiumEpsilonInput,
): NeodymiumEpsilonOutput => {
  const chur = input.churNd143nd144 ?? CHUR_143ND_144ND_TODAY;
  if (!(input.nd143nd144 > 0))
    return simpleError(
      "nd143nd144",
      "The sample 143Nd/144Nd ratio must be greater than zero.",
      "invalid_ratio",
    );
  if (!(chur > 0))
    return simpleError(
      "churNd143nd144",
      "The reference 143Nd/144Nd ratio must be greater than zero.",
      "invalid_ratio",
    );
  return { epsilonNd: (input.nd143nd144 / chur - 1) * 1e4 };
};

export const neodymiumEpsilonExample = {
  input: { nd143nd144: 0.513151, churNd143nd144: 0.512638 },
  output: { epsilonNd: 10.007061513193083 },
} satisfies ToolExample<NeodymiumEpsilonInput, NeodymiumEpsilonOutput>;

export const neodymiumEpsilonTool = createSimpleTool({
  id: "geology/neodymium-epsilon",
  title: "Geology Neodymium Epsilon Calculator",
  description:
    "Express a measured 143Nd/144Nd ratio as epsilon-Nd relative to the chondritic uniform reservoir (CHUR).",
  inputs: [
    {
      description: "Measured present-day 143Nd/144Nd ratio of the sample.",
      id: "nd143nd144",
      kind: "number",
      label: "143Nd/144Nd",
      minimum: 0,
    },
    {
      default: 0.512638,
      description: "Reference CHUR 143Nd/144Nd ratio.",
      id: "churNd143nd144",
      kind: "number",
      label: "CHUR 143Nd/144Nd",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "epsilon-Nd in parts per ten thousand relative to CHUR.",
      id: "epsilonNd",
      kind: "number",
      label: "epsilon Nd",
    },
  ],
  calculate: (input) =>
    calculateNeodymiumEpsilon(input as unknown as NeodymiumEpsilonInput),
});

export const runNeodymiumEpsilon = neodymiumEpsilonTool.execute;
export default neodymiumEpsilonTool;
