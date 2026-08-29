import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AnchorCircleRadiusInput = {
  readonly anchorScopeRatio?: number;
  readonly waterDepthMeters: number;
};

export type AnchorCircleRadiusOutput = {
  readonly anchorCircleRadiusMeters: number;
};

const DEFAULT_ANCHOR_SCOPE_RATIO = 7;

export const anchorCircleRadiusExample = {
  input: { anchorScopeRatio: 7, waterDepthMeters: 8 },
  output: { anchorCircleRadiusMeters: 56 },
} satisfies ToolExample<AnchorCircleRadiusInput, AnchorCircleRadiusOutput>;

export const calculateAnchorCircleRadius = (
  input: AnchorCircleRadiusInput,
): AnchorCircleRadiusOutput => {
  const scope = input.anchorScopeRatio ?? DEFAULT_ANCHOR_SCOPE_RATIO;
  if (input.waterDepthMeters <= 0)
    simpleError(
      "waterDepthMeters",
      "Water depth must be positive.",
      "invalid_input",
    );
  if (scope < 1)
    simpleError(
      "anchorScopeRatio",
      "The scope ratio cannot be less than one.",
      "invalid_input",
    );
  return { anchorCircleRadiusMeters: input.waterDepthMeters * scope };
};

export const anchorCircleRadiusTool = createSimpleTool({
  calculate: (input) =>
    calculateAnchorCircleRadius(input as unknown as AnchorCircleRadiusInput),
  description:
    "Estimate the maximum anchor-to-bow radius from water depth and rode scope. Add the vessel length when checking the full area swept by the stern.",
  id: "sailing/anchor-circle-radius",
  inputs: [
    {
      default: DEFAULT_ANCHOR_SCOPE_RATIO,
      description:
        "Ratio of rode paid out to depth; seven to one is standard for overnight anchoring.",
      id: "anchorScopeRatio",
      kind: "number",
      label: "Anchor scope ratio",
      maximum: 15,
      minimum: 1,
    },
    {
      description:
        "Water depth at anchor; add freeboard to the charted depth for best accuracy.",
      format: "length-m",
      id: "waterDepthMeters",
      kind: "number",
      label: "Water depth",
      unit: "m",
    },
  ],
  outputs: [
    {
      description:
        "Maximum anchor-to-bow radius; this does not include the vessel length.",
      format: "length-m",
      id: "anchorCircleRadiusMeters",
      kind: "number",
      label: "Anchor circle radius",
      unit: "m",
    },
  ],
  title: "Anchor Circle Radius Calculator",
});
export const runAnchorCircleRadius = anchorCircleRadiusTool.execute;
export default anchorCircleRadiusTool;
