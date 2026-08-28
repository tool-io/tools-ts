import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const PhenolphthaleinRangeCheckerTool = createSimpleTool({
  id: "chemistry/phenolphthalein-range-checker",
  title: "Phenolphthalein Range Checker",
  description:
    "Check whether a pH falls within phenolphthalein transition range 8.2-10.0.",
  inputs: [{ id: "ph", label: "pH", kind: "number" }],
  outputs: [{ id: "inRange", label: "In range", kind: "boolean" }],
  calculate: (input) => {
    return {
      inRange: (input.ph as number) >= 8.2 && (input.ph as number) <= 10.0,
    };
  },
});
export default PhenolphthaleinRangeCheckerTool;
export const runPhenolphthaleinRangeChecker =
  PhenolphthaleinRangeCheckerTool.execute;

export type PhenolphthaleinRangeCheckerInput = {
  readonly ph: number;
};

export type PhenolphthaleinRangeCheckerOutput = {
  readonly inRange: boolean;
};

export const phenolphthaleinRangeCheckerExample = {
  input: {
    ph: 1,
  },
  output: {
    inRange: false,
  },
} satisfies ToolExample<
  PhenolphthaleinRangeCheckerInput,
  PhenolphthaleinRangeCheckerOutput
>;
