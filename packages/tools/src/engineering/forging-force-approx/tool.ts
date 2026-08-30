import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ForgingForceApproxInput = Readonly<{
  readonly contactAreaSquareMillimeters: number;
  readonly meanFlowStressMegapascals: number;
  readonly shapeFactor: number;
}>;
export type ForgingForceApproxOutput = Readonly<{
  readonly forceNewtons: number;
}>;

export const calculateForgingForceApprox = (
  x: ForgingForceApproxInput,
): ForgingForceApproxOutput => {
  if (
    !Number.isFinite(x.contactAreaSquareMillimeters) ||
    x.contactAreaSquareMillimeters < 0
  )
    simpleError(
      "contactAreaSquareMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.meanFlowStressMegapascals) ||
    x.meanFlowStressMegapascals < 0
  )
    simpleError(
      "meanFlowStressMegapascals",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.shapeFactor) || x.shapeFactor < 0)
    simpleError("shapeFactor", "Provide a finite number at least 0.");
  const forceNewtons =
    x.contactAreaSquareMillimeters *
    x.meanFlowStressMegapascals *
    x.shapeFactor;
  if (!Number.isFinite(forceNewtons))
    simpleError(
      "forceNewtons",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { forceNewtons: Object.is(forceNewtons, -0) ? 0 : forceNewtons };
};

export const example = {
  input: {
    contactAreaSquareMillimeters: 1000,
    meanFlowStressMegapascals: 100,
    shapeFactor: 1.2,
  },
  output: { forceNewtons: 120000 },
} satisfies ToolExample<ForgingForceApproxInput, ForgingForceApproxOutput>;

export const tool = createSimpleTool({
  id: "engineering/forging-force-approx",
  title: "Forging Force Approx",
  description:
    "First-pass forging force from projected contact area, average flow stress and a supplied dimensionless shape/friction factor.",
  inputs: [
    {
      id: "contactAreaSquareMillimeters",
      kind: "number",
      label: "Contact Area Square Millimeters",
      unit: "mm²",
      minimum: 0,
    },
    {
      id: "meanFlowStressMegapascals",
      kind: "number",
      label: "Mean Flow Stress Megapascals",
      unit: "MPa",
      minimum: 0,
    },
    { id: "shapeFactor", kind: "number", label: "Shape Factor", minimum: 0 },
  ],
  outputs: [
    { id: "forceNewtons", kind: "number", label: "Force Newtons", unit: "N" },
  ],
  calculate: (input) =>
    calculateForgingForceApprox({
      contactAreaSquareMillimeters:
        input.contactAreaSquareMillimeters as number,
      meanFlowStressMegapascals: input.meanFlowStressMegapascals as number,
      shapeFactor: input.shapeFactor as number,
    }),
});
export const forgingForceApproxTool = tool;
export const runForgingForceApprox = tool.execute;
export default tool;
