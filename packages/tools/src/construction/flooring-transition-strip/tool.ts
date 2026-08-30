import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlooringTransitionStripInput = Readonly<{
  readonly boundaryWidthsM: readonly number[];
}>;
export type FlooringTransitionStripOutput = Readonly<{
  readonly stripLengthM: number;
}>;

export const calculateFlooringTransitionStrip = (
  x: FlooringTransitionStripInput,
): FlooringTransitionStripOutput => {
  if (
    !Array.isArray(x.boundaryWidthsM) ||
    !x.boundaryWidthsM.every((v) => typeof v === "number" && Number.isFinite(v))
  )
    simpleError("boundaryWidthsM", "Provide a finite number list.");
  if (!x.boundaryWidthsM.every((v) => v >= 0))
    simpleError("boundaryWidthsM", "Boundary widths cannot be negative.");
  const stripLengthM = x.boundaryWidthsM.reduce((a, b) => a + b, 0);
  if (!Number.isFinite(stripLengthM))
    simpleError("stripLengthM", "The inputs produce an invalid result.");
  return { stripLengthM: Object.is(stripLengthM, -0) ? 0 : stripLengthM };
};

export const example = {
  input: { boundaryWidthsM: [0.8, 1.2] },
  output: { stripLengthM: 2 },
} satisfies ToolExample<
  FlooringTransitionStripInput,
  FlooringTransitionStripOutput
>;

export const tool = createSimpleTool({
  id: "construction/flooring-transition-strip",
  title: "Flooring Transition Strip",
  description:
    "Total transition-strip length from measured doorway or flooring-boundary widths.",
  inputs: [
    {
      id: "boundaryWidthsM",
      kind: "numberList",
      label: "Transition widths",
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "stripLengthM",
      kind: "number",
      label: "Required strip length",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateFlooringTransitionStrip({
      boundaryWidthsM: input.boundaryWidthsM as readonly number[],
    }),
});
export const flooringTransitionStripTool = tool;
export const runFlooringTransitionStrip = tool.execute;
export default tool;
