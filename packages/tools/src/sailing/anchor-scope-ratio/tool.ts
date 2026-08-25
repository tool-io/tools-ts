import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AnchorScopeRatioInput = {
  readonly depthFt: number;
  readonly freeboardFt?: number;
  readonly rodeLengthFt: number;
};

export type AnchorScopeRatioOutput = {
  readonly scopeRatio: number;
};

export const anchorScopeRatioExample = {
  input: { depthFt: 20, freeboardFt: 4, rodeLengthFt: 168 },
  output: { scopeRatio: 7 },
} satisfies ToolExample<AnchorScopeRatioInput, AnchorScopeRatioOutput>;

export const calculateAnchorScopeRatio = (
  input: AnchorScopeRatioInput,
): AnchorScopeRatioOutput => {
  const total = input.depthFt + (input.freeboardFt ?? 0);
  if ((input.freeboardFt ?? 0) < 0)
    simpleError(
      "freeboardFt",
      "Freeboard cannot be negative.",
      "invalid_height",
    );
  if (total <= 0)
    simpleError(
      "depthFt",
      "The water depth must be positive.",
      "invalid_depth",
    );
  return { scopeRatio: input.rodeLengthFt / total };
};

export const anchorScopeRatioTool = createSimpleTool({
  calculate: (input) =>
    calculateAnchorScopeRatio(input as unknown as AnchorScopeRatioInput),
  description:
    "Compute the scope ratio from the deployed rode length and the total height to the bow chock.",
  id: "sailing/anchor-scope-ratio",
  inputs: [
    {
      description: "Water depth at anchor.",
      id: "depthFt",
      kind: "number",
      label: "Depth",
      minimum: 0,
      unit: "ft",
    },
    {
      default: 0,
      description: "Height of the bow chock above the water.",
      id: "freeboardFt",
      kind: "number",
      label: "Freeboard",
      minimum: 0,
      unit: "ft",
    },
    {
      description: "Length of rode deployed.",
      id: "rodeLengthFt",
      kind: "number",
      label: "Rode length",
      unit: "ft",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Ratio of rode length to depth plus freeboard; seven is standard for overnight.",
      format: "ratio",
      id: "scopeRatio",
      kind: "number",
      label: "Scope ratio",
    },
  ],
  title: "Anchor Scope Ratio Calculator",
});
export const runAnchorScopeRatio = anchorScopeRatioTool.execute;
export default anchorScopeRatioTool;
