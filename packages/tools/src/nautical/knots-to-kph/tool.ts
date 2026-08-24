import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const KPH_PER_KNOT = 1.852;

export type KnotsToKphInput = {
  readonly knots: number;
};

export type KnotsToKphOutput = {
  readonly kilometersPerHour: number;
};

export const knotsToKphExample = {
  input: { knots: 10 },
  output: { kilometersPerHour: 18.52 },
} satisfies ToolExample<KnotsToKphInput, KnotsToKphOutput>;

export const knotsToKphTool = createSimpleTool({
  id: "nautical/knots-to-kph",
  title: "Knots to Kilometers Per Hour Converter",
  description:
    "Convert a speed in knots to kilometers per hour using the exact factor of one point eight five two.",
  inputs: [{ id: "knots", kind: "number", label: "Knots", minimum: 0 }],
  outputs: [
    { id: "kilometersPerHour", kind: "number", label: "Kilometers per hour" },
  ],
  calculate: (input) => ({
    kilometersPerHour: (input.knots as number) * KPH_PER_KNOT,
  }),
});
export const runKnotsToKph = knotsToKphTool.execute;
export default knotsToKphTool;
