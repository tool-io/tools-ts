import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RetainingWallSlidingSafetyInput = Readonly<{
  readonly frictionCoefficient: number;
  readonly effectiveNormalNewtons: number;
  readonly horizontalDriveNewtons: number;
}>;
export type RetainingWallSlidingSafetyOutput = Readonly<{
  readonly slidingRatio: number;
}>;

export const calculateRetainingWallSlidingSafety = (
  x: RetainingWallSlidingSafetyInput,
): RetainingWallSlidingSafetyOutput => {
  if (!Number.isFinite(x.frictionCoefficient) || x.frictionCoefficient < 0)
    simpleError("frictionCoefficient", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.effectiveNormalNewtons) ||
    x.effectiveNormalNewtons < 0
  )
    simpleError(
      "effectiveNormalNewtons",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.horizontalDriveNewtons) ||
    x.horizontalDriveNewtons < 0
  )
    simpleError(
      "horizontalDriveNewtons",
      "Provide a finite number at least 0.",
    );
  const slidingRatio =
    (x.frictionCoefficient * x.effectiveNormalNewtons) /
    x.horizontalDriveNewtons;
  if (!Number.isFinite(slidingRatio))
    simpleError(
      "slidingRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { slidingRatio: Object.is(slidingRatio, -0) ? 0 : slidingRatio };
};

export const example = {
  input: {
    frictionCoefficient: 0.5,
    effectiveNormalNewtons: 100000,
    horizontalDriveNewtons: 20000,
  },
  output: { slidingRatio: 2.5 },
} satisfies ToolExample<
  RetainingWallSlidingSafetyInput,
  RetainingWallSlidingSafetyOutput
>;

export const tool = createSimpleTool({
  id: "engineering/retaining-wall-sliding-safety",
  title: "Retaining Wall Sliding Safety",
  description:
    "Ideal sliding resistance ratio μN/H from effective base normal load, assumed friction coefficient and horizontal driving load; excludes passive resistance.",
  inputs: [
    {
      id: "frictionCoefficient",
      kind: "number",
      label: "Friction Coefficient",
      minimum: 0,
    },
    {
      id: "effectiveNormalNewtons",
      kind: "number",
      label: "Effective Normal Newtons",
      unit: "N",
      minimum: 0,
    },
    {
      id: "horizontalDriveNewtons",
      kind: "number",
      label: "Horizontal Drive Newtons",
      unit: "N",
      minimum: 0,
    },
  ],
  outputs: [{ id: "slidingRatio", kind: "number", label: "Sliding Ratio" }],
  calculate: (input) =>
    calculateRetainingWallSlidingSafety({
      frictionCoefficient: input.frictionCoefficient as number,
      effectiveNormalNewtons: input.effectiveNormalNewtons as number,
      horizontalDriveNewtons: input.horizontalDriveNewtons as number,
    }),
});
export const retainingWallSlidingSafetyTool = tool;
export const runRetainingWallSlidingSafety = tool.execute;
export default tool;
