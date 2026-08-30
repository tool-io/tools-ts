import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PlanAreaToRealAreaInput = Readonly<{
  readonly planSquareCentimeters: number;
  readonly denominator: number;
}>;
export type PlanAreaToRealAreaOutput = Readonly<{
  readonly groundSquareMeters: number;
}>;

export const calculatePlanAreaToRealArea = (
  x: PlanAreaToRealAreaInput,
): PlanAreaToRealAreaOutput => {
  if (!Number.isFinite(x.planSquareCentimeters) || x.planSquareCentimeters < 0)
    simpleError(
      "planSquareCentimeters",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.denominator) || x.denominator <= 0)
    simpleError("denominator", "Provide a finite positive number.");
  const groundSquareMeters =
    (x.planSquareCentimeters * x.denominator * x.denominator) / 10000;
  if (!Number.isFinite(groundSquareMeters))
    simpleError(
      "groundSquareMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    groundSquareMeters: Object.is(groundSquareMeters, -0)
      ? 0
      : groundSquareMeters,
  };
};

export const example = {
  input: {
    planSquareCentimeters: 100,
    denominator: 1000,
  },
  output: { groundSquareMeters: 10000 },
} satisfies ToolExample<PlanAreaToRealAreaInput, PlanAreaToRealAreaOutput>;

export const tool = createSimpleTool({
  id: "cartography/plan-area-to-real-area",
  title: "Plan Area To Real Area",
  description:
    "Ground area in square metres represented by a plan area in square centimetres at scale 1:N.",
  inputs: [
    {
      id: "planSquareCentimeters",
      kind: "number",
      label: "Plan Square Centimeters",
      unit: "cm2",
      minimum: 0,
    },
    { id: "denominator", kind: "number", label: "Denominator", minimum: 0 },
  ],
  outputs: [
    {
      id: "groundSquareMeters",
      kind: "number",
      label: "Ground Square Meters",
      unit: "m2",
    },
  ],
  calculate: (input) =>
    calculatePlanAreaToRealArea({
      planSquareCentimeters: input.planSquareCentimeters as number,
      denominator: input.denominator as number,
    }),
});
export const planAreaToRealAreaTool = tool;
export const runPlanAreaToRealArea = tool.execute;
export default tool;
