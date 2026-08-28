import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const BromothymolBlueRangeTool = createSimpleTool({
  id: "chemistry/bromothymol-blue-range",
  title: "Bromothymol Blue Range Checker",
  description:
    "Check whether a pH falls within bromothymol blue range 6.0-7.6.",
  inputs: [{ id: "ph", label: "pH", kind: "number" }],
  outputs: [{ id: "inRange", label: "In range", kind: "boolean" }],
  calculate: (input) => {
    return {
      inRange: (input.ph as number) >= 6.0 && (input.ph as number) <= 7.6,
    };
  },
});
export default BromothymolBlueRangeTool;
export const runBromothymolBlueRange = BromothymolBlueRangeTool.execute;

export type BromothymolBlueRangeInput = {
  readonly ph: number;
};

export type BromothymolBlueRangeOutput = {
  readonly inRange: boolean;
};

export const bromothymolBlueRangeExample = {
  input: {
    ph: 1,
  },
  output: {
    inRange: false,
  },
} satisfies ToolExample<BromothymolBlueRangeInput, BromothymolBlueRangeOutput>;
