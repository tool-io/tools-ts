import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SailAreaInput = {
  readonly pLengthFt: number;
  readonly eFootFt: number;
};

export type SailAreaOutput = {
  readonly areaFt2: number;
};

export const sailAreaExample = {
  input: { eFootFt: 12, pLengthFt: 40 },
  output: { areaFt2: 240 },
} satisfies ToolExample<SailAreaInput, SailAreaOutput>;

export const calculateSailArea = (input: SailAreaInput): SailAreaOutput => {
  if (input.pLengthFt <= 0 || input.eFootFt <= 0)
    simpleError(
      "pLengthFt",
      "P and E dimensions must be positive.",
      "invalid_dimensions",
    );
  return { areaFt2: (input.pLengthFt * input.eFootFt) / 2 };
};

export const sailAreaTool = createSimpleTool({
  calculate: (input) => calculateSailArea(input as unknown as SailAreaInput),
  description:
    "Compute the triangular mainsail area from the luff (P) and foot (E) measurements.",
  id: "sailing/sail-area",
  inputs: [
    {
      description: "Luff length along the mast (P dimension).",
      id: "pLengthFt",
      kind: "number",
      label: "P",
      unit: "ft",
    },
    {
      description: "Foot length along the boom (E dimension).",
      id: "eFootFt",
      kind: "number",
      label: "E",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description: "Triangular sail area.",
      format: "area-ft2",
      id: "areaFt2",
      kind: "number",
      label: "Sail area",
      unit: "ft²",
    },
  ],
  title: "Sail Area Calculator",
});
export const runSailArea = sailAreaTool.execute;
export default sailAreaTool;
