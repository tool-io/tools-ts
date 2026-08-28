import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const bondLengthFromOrderTool = createSimpleTool({
  id: "chemistry/bond-length-from-order",
  title: "Bond Length From Order Calculator",
  description:
    "Estimate bond length from bond order using empirical scaling of the single-bond reference length.",
  inputs: [
    {
      description: "Bond order (1=single, 2=double, 3=triple).",
      id: "bondOrder",
      kind: "number",
      label: "Bond order",
      minimum: 1,
    },
    {
      description: "Reference single-bond length in picometers.",
      id: "singleBondLengthPm",
      kind: "number",
      label: "Single bond length",
      minimum: 0,
      unit: "pm",
    },
  ],
  outputs: [
    {
      description: "Estimated bond length for this order.",
      id: "bondLengthPm",
      kind: "number",
      label: "Bond length",
      unit: "pm",
    },
  ],
  calculate: (input) => {
    if (!((input.singleBondLengthPm as number) > 0))
      simpleError(
        "singleBondLengthPm",
        "Reference bond length must be greater than zero.",
        "invalid_length",
      );
    return {
      bondLengthPm:
        (input.singleBondLengthPm as number) *
        Math.pow(input.bondOrder as number, -1 / 3),
    };
  },
});
export const runBondLengthFromOrder = bondLengthFromOrderTool.execute;
export default bondLengthFromOrderTool;

export type BondLengthFromOrderInput = {
  readonly bondOrder: number;
  readonly singleBondLengthPm: number;
};

export type BondLengthFromOrderOutput = {
  readonly bondLengthPm: number;
};

export const bondLengthFromOrderExample = {
  input: {
    bondOrder: 1,
    singleBondLengthPm: 1,
  },
  output: {
    bondLengthPm: 1,
  },
} satisfies ToolExample<BondLengthFromOrderInput, BondLengthFromOrderOutput>;
