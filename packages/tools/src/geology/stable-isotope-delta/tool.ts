import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StableIsotopeDeltaInput = {
  readonly ratioSample: number;
  readonly ratioStandard: number;
};

export type StableIsotopeDeltaOutput = {
  readonly deltaPerMil: number;
};

/**
 * Delta notation: delta = (R_sample / R_standard - 1) * 1000 permil.
 */
export const calculateStableIsotopeDelta = (
  input: StableIsotopeDeltaInput,
): StableIsotopeDeltaOutput => {
  if (!(input.ratioSample > 0))
    return simpleError(
      "ratioSample",
      "The sample isotope ratio must be greater than zero.",
      "invalid_ratio",
    );
  if (!(input.ratioStandard > 0))
    return simpleError(
      "ratioStandard",
      "The standard isotope ratio must be greater than zero.",
      "invalid_ratio",
    );
  return {
    deltaPerMil: (input.ratioSample / input.ratioStandard - 1) * 1000,
  };
};

export const stableIsotopeDeltaExample = {
  input: { ratioSample: 0.02075, ratioStandard: 0.0207 },
  output: { deltaPerMil: 2.4154589371980784 },
} satisfies ToolExample<StableIsotopeDeltaInput, StableIsotopeDeltaOutput>;

export const stableIsotopeDeltaTool = createSimpleTool({
  id: "geology/stable-isotope-delta",
  title: "Geology Stable Isotope Delta Calculator",
  description:
    "Convert sample and standard isotope ratios into delta notation in permil relative to the standard.",
  inputs: [
    {
      description: "Heavy/light isotope ratio of the sample.",
      id: "ratioSample",
      kind: "number",
      label: "R sample",
      minimum: 0,
    },
    {
      description: "Heavy/light isotope ratio of the standard.",
      id: "ratioStandard",
      kind: "number",
      label: "R standard",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Delta value in permil relative to the standard.",
      id: "deltaPerMil",
      kind: "number",
      label: "Delta",
    },
  ],
  calculate: (input) =>
    calculateStableIsotopeDelta(input as unknown as StableIsotopeDeltaInput),
});

export const runStableIsotopeDelta = stableIsotopeDeltaTool.execute;
export default stableIsotopeDeltaTool;
