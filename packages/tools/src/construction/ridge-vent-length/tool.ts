import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RidgeVentLengthInput = Readonly<{
  readonly ridgeMeters: number;
  readonly blockedMeters: number;
}>;
export type RidgeVentLengthOutput = Readonly<{
  readonly ventMeters: number;
}>;

export const calculateRidgeVentLength = (
  x: RidgeVentLengthInput,
): RidgeVentLengthOutput => {
  if (!Number.isFinite(x.ridgeMeters) || x.ridgeMeters < 0)
    simpleError("ridgeMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.blockedMeters) || x.blockedMeters < 0)
    simpleError("blockedMeters", "Provide a finite number at least 0.");
  if (x.blockedMeters > x.ridgeMeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const ventMeters = x.ridgeMeters - x.blockedMeters;
  if (!Number.isFinite(ventMeters))
    simpleError(
      "ventMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { ventMeters: Object.is(ventMeters, -0) ? 0 : ventMeters };
};

export const example = {
  input: { ridgeMeters: 20, blockedMeters: 2 },
  output: { ventMeters: 18 },
} satisfies ToolExample<RidgeVentLengthInput, RidgeVentLengthOutput>;

export const tool = createSimpleTool({
  id: "construction/ridge-vent-length",
  title: "Ridge Vent Length",
  description:
    "Installable ridge-vent length after deducting unvented sections from total measured ridge length.",
  inputs: [
    {
      id: "ridgeMeters",
      kind: "number",
      label: "Ridge Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "blockedMeters",
      kind: "number",
      label: "Blocked Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "ventMeters", kind: "number", label: "Vent Meters", unit: "m" },
  ],
  calculate: (input) =>
    calculateRidgeVentLength({
      ridgeMeters: input.ridgeMeters as number,
      blockedMeters: input.blockedMeters as number,
    }),
});
export const ridgeVentLengthTool = tool;
export const runRidgeVentLength = tool.execute;
export default tool;
