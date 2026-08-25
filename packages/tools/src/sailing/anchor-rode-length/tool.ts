import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AnchorRodeLengthInput = {
  readonly depthFt: number;
  readonly freeboardFt?: number;
  readonly scopeRatio?: number;
};

export type AnchorRodeLengthOutput = {
  readonly rodeLengthFt: number;
};

const DEFAULT_SCOPE = 7;
const DEFAULT_FREEBOARD_FT = 4;

export const anchorRodeLengthExample = {
  input: { depthFt: 20, freeboardFt: 4, scopeRatio: 7 },
  output: { rodeLengthFt: 168 },
} satisfies ToolExample<AnchorRodeLengthInput, AnchorRodeLengthOutput>;

export const calculateAnchorRodeLength = (
  input: AnchorRodeLengthInput,
): AnchorRodeLengthOutput => {
  const freeboard = input.freeboardFt ?? DEFAULT_FREEBOARD_FT;
  const scope = input.scopeRatio ?? DEFAULT_SCOPE;
  if (input.depthFt <= 0 || freeboard < 0 || scope <= 0)
    simpleError(
      "depthFt",
      "Depth must be positive and freeboard non-negative.",
      "invalid_input",
    );
  return { rodeLengthFt: (input.depthFt + freeboard) * scope };
};

export const anchorRodeLengthTool = createSimpleTool({
  calculate: (input) =>
    calculateAnchorRodeLength(input as unknown as AnchorRodeLengthInput),
  description:
    "Compute the anchor rode length needed from water depth, freeboard, and scope ratio.",
  id: "sailing/anchor-rode-length",
  inputs: [
    {
      description: "Water depth at anchor.",
      id: "depthFt",
      kind: "number",
      label: "Depth",
      unit: "ft",
    },
    {
      default: 4,
      description: "Height of the bow chock above the water.",
      id: "freeboardFt",
      kind: "number",
      label: "Freeboard",
      unit: "ft",
    },
    {
      default: 7,
      description: "Scope ratio; seven to one is standard for overnight.",
      id: "scopeRatio",
      kind: "number",
      label: "Scope ratio",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Total rode (chain plus rope) to deploy.",
      format: "length-ft",
      id: "rodeLengthFt",
      kind: "number",
      label: "Rode length",
      unit: "ft",
    },
  ],
  title: "Anchor Rode Length Calculator",
});
export const runAnchorRodeLength = anchorRodeLengthTool.execute;
export default anchorRodeLengthTool;
