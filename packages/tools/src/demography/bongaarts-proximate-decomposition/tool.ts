import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BongaartsProximateDecompositionInput = {
  readonly tfr: number;
  readonly indexMarriageCm: number;
  readonly indexContraceptionCc: number;
  readonly indexAbortionCa: number;
};

export type BongaartsProximateDecompositionOutput = {
  readonly totalFecundityTf: number;
};

export const calculateBongaartsProximateDecomposition = (
  input: BongaartsProximateDecompositionInput,
): BongaartsProximateDecompositionOutput => {
  if (!(input.tfr > 0))
    simpleError(
      "tfr",
      "The observed TFR must be greater than zero.",
      "invalid_tfr",
    );
  for (const key of [
    "indexMarriageCm",
    "indexContraceptionCc",
    "indexAbortionCa",
  ] as const) {
    const value = input[key];
    if (!((value as number) > 0 && (value as number) <= 1))
      simpleError(
        key,
        "Bongaarts indexes must lie between zero (exclusive) and one.",
        "invalid_index",
      );
  }
  return {
    totalFecundityTf:
      input.tfr /
      (input.indexMarriageCm *
        input.indexContraceptionCc *
        input.indexAbortionCa),
  };
};

export const bongaartsProximateDecompositionExample = {
  input: {
    tfr: 3.5,
    indexMarriageCm: 0.9,
    indexContraceptionCc: 0.8,
    indexAbortionCa: 0.95,
  },
  output: { totalFecundityTf: 5.116959064327485 },
} satisfies ToolExample<
  BongaartsProximateDecompositionInput,
  BongaartsProximateDecompositionOutput
>;

export const bongaartsProximateDecompositionTool = createSimpleTool({
  id: "demography/bongaarts-proximate-decomposition",
  title: "Bongaarts Proximate Decomposition Calculator",
  description:
    "Invert the Bongaarts proximate-determinants identity TF = TFR / (Cm x Cc x Ca), recovering total fecundity from the observed TFR and the marriage, contraception and abortion indexes.",
  inputs: [
    {
      description: "Observed period total fertility rate.",
      id: "tfr",
      kind: "number",
      label: "TFR",
      minimum: 0,
    },
    {
      description: "Index of marriage Cm in (0, 1].",
      id: "indexMarriageCm",
      kind: "number",
      label: "Cm",
      minimum: 0,
    },
    {
      description: "Index of contraception Cc in (0, 1].",
      id: "indexContraceptionCc",
      kind: "number",
      label: "Cc",
      minimum: 0,
    },
    {
      description: "Index of induced abortion Ca in (0, 1].",
      id: "indexAbortionCa",
      kind: "number",
      label: "Ca",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Implied total fecundity TF.",
      id: "totalFecundityTf",
      kind: "number",
      label: "TF",
    },
  ],
  calculate: (input) =>
    calculateBongaartsProximateDecomposition(
      input as unknown as BongaartsProximateDecompositionInput,
    ),
});

export const runBongaartsProximateDecomposition =
  bongaartsProximateDecompositionTool.execute;
export default bongaartsProximateDecompositionTool;
