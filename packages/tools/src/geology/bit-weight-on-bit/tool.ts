import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BitWeightOnBitInput = {
  readonly stringWeightOffBottomKilonewtons: number;
  readonly stringWeightOnBottomKilonewtons: number;
};

export type BitWeightOnBitOutput = {
  readonly weightOnBitKilonewtons: number;
};

export const calculateBitWeightOnBit = (
  input: BitWeightOnBitInput,
): BitWeightOnBitOutput => {
  if (!(input.stringWeightOffBottomKilonewtons >= 0))
    return simpleError(
      "stringWeightOffBottomKilonewtons",
      "Off-bottom string weight cannot be negative.",
      "invalid_weight",
    );
  if (!(input.stringWeightOnBottomKilonewtons >= 0))
    return simpleError(
      "stringWeightOnBottomKilonewtons",
      "On-bottom string weight cannot be negative.",
      "invalid_weight",
    );
  if (
    !(
      input.stringWeightOffBottomKilonewtons >
      input.stringWeightOnBottomKilonewtons
    )
  )
    return simpleError(
      "stringWeightOnBottomKilonewtons",
      "On-bottom hook load must be lower than the off-bottom hook load.",
      "invalid_weight",
    );
  return {
    weightOnBitKilonewtons:
      input.stringWeightOffBottomKilonewtons -
      input.stringWeightOnBottomKilonewtons,
  };
};

export const bitWeightOnBitExample = {
  input: {
    stringWeightOffBottomKilonewtons: 900,
    stringWeightOnBottomKilonewtons: 720,
  },
  output: { weightOnBitKilonewtons: 180 },
} satisfies ToolExample<BitWeightOnBitInput, BitWeightOnBitOutput>;

export const bitWeightOnBitTool = createSimpleTool({
  id: "geology/bit-weight-on-bit",
  title: "Bit Weight On Bit Calculator",
  description:
    "Determine weight on bit from the difference between off-bottom and on-bottom hook loads.",
  inputs: [
    {
      description: "Hook load with the string off bottom in kilonewtons.",
      id: "stringWeightOffBottomKilonewtons",
      kind: "number",
      label: "Off-bottom load",
    },
    {
      description: "Hook load with the string on bottom in kilonewtons.",
      id: "stringWeightOnBottomKilonewtons",
      kind: "number",
      label: "On-bottom load",
    },
  ],
  outputs: [
    {
      description: "Weight carried by the bit in kilonewtons.",
      id: "weightOnBitKilonewtons",
      kind: "number",
      label: "WOB",
    },
  ],
  calculate: (input) =>
    calculateBitWeightOnBit(input as unknown as BitWeightOnBitInput),
});

export const runBitWeightOnBit = bitWeightOnBitTool.execute;
export default bitWeightOnBitTool;
