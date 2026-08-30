import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MillimetersToPointsPrintInput = Readonly<{
  readonly millimeters: number;
}>;
export type MillimetersToPointsPrintOutput = Readonly<{
  readonly points: number;
}>;

export const calculateMillimetersToPointsPrint = (
  x: MillimetersToPointsPrintInput,
): MillimetersToPointsPrintOutput => {
  if (!Number.isFinite(x.millimeters) || x.millimeters < 0)
    simpleError("millimeters", "Provide a finite nonnegative number.");
  const points = (x.millimeters * 72) / 25.4;
  if (!Number.isFinite(points))
    simpleError(
      "points",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { points: Object.is(points, -0) ? 0 : points };
};

export const example = {
  input: {
    millimeters: 25.4,
  },
  output: { points: 72 },
} satisfies ToolExample<
  MillimetersToPointsPrintInput,
  MillimetersToPointsPrintOutput
>;

export const tool = createSimpleTool({
  id: "typography/millimeters-to-points-print",
  title: "Millimeters To Points Print",
  description:
    "PostScript points from millimetres using 25.4 mm per inch and 72 points per inch.",
  inputs: [
    {
      id: "millimeters",
      kind: "number",
      label: "Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [{ id: "points", kind: "number", label: "Points", unit: "pt" }],
  calculate: (input) =>
    calculateMillimetersToPointsPrint({
      millimeters: input.millimeters as number,
    }),
});
export const millimetersToPointsPrintTool = tool;
export const runMillimetersToPointsPrint = tool.execute;
export default tool;
