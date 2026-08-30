import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LumberShrinkagePercentageInput = Readonly<{
  readonly initialMillimeters: number;
  readonly finalMillimeters: number;
}>;
export type LumberShrinkagePercentageOutput = Readonly<{
  readonly shrinkagePercent: number;
}>;

export const calculateLumberShrinkagePercentage = (
  x: LumberShrinkagePercentageInput,
): LumberShrinkagePercentageOutput => {
  if (!Number.isFinite(x.initialMillimeters) || x.initialMillimeters < 0)
    simpleError("initialMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.finalMillimeters) || x.finalMillimeters < 0)
    simpleError("finalMillimeters", "Provide a finite number at least 0.");
  if (x.finalMillimeters > x.initialMillimeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const shrinkagePercent =
    (100 * (x.initialMillimeters - x.finalMillimeters)) / x.initialMillimeters;
  if (!Number.isFinite(shrinkagePercent))
    simpleError(
      "shrinkagePercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    shrinkagePercent: Object.is(shrinkagePercent, -0) ? 0 : shrinkagePercent,
  };
};

export const example = {
  input: { initialMillimeters: 100, finalMillimeters: 95 },
  output: { shrinkagePercent: 5 },
} satisfies ToolExample<
  LumberShrinkagePercentageInput,
  LumberShrinkagePercentageOutput
>;

export const tool = createSimpleTool({
  id: "construction/lumber-shrinkage-percentage",
  title: "Lumber Shrinkage Percentage",
  description:
    "Linear shrinkage percentage from the larger initial dimension and smaller final dimension measured along the same grain direction.",
  inputs: [
    {
      id: "initialMillimeters",
      kind: "number",
      label: "Initial Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "finalMillimeters",
      kind: "number",
      label: "Final Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "shrinkagePercent",
      kind: "number",
      label: "Shrinkage Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateLumberShrinkagePercentage({
      initialMillimeters: input.initialMillimeters as number,
      finalMillimeters: input.finalMillimeters as number,
    }),
});
export const lumberShrinkagePercentageTool = tool;
export const runLumberShrinkagePercentage = tool.execute;
export default tool;
