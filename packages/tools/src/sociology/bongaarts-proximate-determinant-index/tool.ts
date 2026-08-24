import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BongaartsProximateDeterminantIndexInput = {
  readonly contraceptionIndex: number;
  readonly inducedAbortionIndex: number;
  readonly marriageIndex: number;
  readonly postpartumInfecundabilityIndex: number;
};

export type BongaartsProximateDeterminantIndexOutput = {
  readonly proximateDeterminantsIndex: number;
};

export const bongaartsProximateDeterminantIndexExample = {
  input: {
    contraceptionIndex: 0.7,
    inducedAbortionIndex: 0.95,
    marriageIndex: 0.6,
    postpartumInfecundabilityIndex: 0.8,
  },
  output: {
    proximateDeterminantsIndex: 0.3192,
  },
} satisfies ToolExample<
  BongaartsProximateDeterminantIndexInput,
  BongaartsProximateDeterminantIndexOutput
>;

const INDICES: readonly (keyof BongaartsProximateDeterminantIndexInput)[] = [
  "marriageIndex",
  "contraceptionIndex",
  "inducedAbortionIndex",
  "postpartumInfecundabilityIndex",
];

export const calculateBongaartsProximateIndex = (
  input: BongaartsProximateDeterminantIndexInput,
): BongaartsProximateDeterminantIndexOutput => {
  let product = 1;
  for (const key of INDICES) {
    const value = input[key];
    if (!Number.isFinite(value) || value < 0 || value > 1)
      simpleError(
        key,
        "Each proximate determinant index must sit between zero and one.",
        "invalid_value",
      );
    product *= value;
  }
  return {
    proximateDeterminantsIndex: product,
  };
};

export const bongaartsProximateDeterminantIndexTool = createSimpleTool({
  calculate: (input) =>
    calculateBongaartsProximateIndex({
      contraceptionIndex: input.contraceptionIndex as number,
      inducedAbortionIndex: input.inducedAbortionIndex as number,
      marriageIndex: input.marriageIndex as number,
      postpartumInfecundabilityIndex:
        input.postpartumInfecundabilityIndex as number,
    }),
  description:
    "Multiply the Bongaarts proximate determinant indices for marriage, contraception, abortion, and postpartum infecundability.",
  id: "sociology/bongaarts-proximate-determinant-index",
  inputs: [
    {
      description: "Proportion reduction from non-marriage.",
      id: "marriageIndex",
      kind: "number",
      label: "Marriage index",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Proportion reduction from contraceptive use.",
      id: "contraceptionIndex",
      kind: "number",
      label: "Contraception index",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Proportion reduction from induced abortion.",
      id: "inducedAbortionIndex",
      kind: "number",
      label: "Abortion index",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Proportion reduction from postpartum infecundability.",
      id: "postpartumInfecundabilityIndex",
      kind: "number",
      label: "Postpartum index",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Combined fraction of natural fertility actually realized.",
      id: "proximateDeterminantsIndex",
      kind: "number",
      label: "Combined index",
    },
  ],
  title: "Bongaarts Proximate Determinant Index Calculator",
});
export const runBongaartsProximateDeterminantIndex =
  bongaartsProximateDeterminantIndexTool.execute;
export default bongaartsProximateDeterminantIndexTool;
