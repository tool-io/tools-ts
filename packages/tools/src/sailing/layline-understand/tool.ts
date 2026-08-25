import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LaylineUnderstandInput = {
  readonly distanceToMarkNm: number;
  readonly understandDegrees: number;
  readonly tackingAngleDeg: number;
};

export type LaylineUnderstandOutput = {
  readonly understandDistanceNm: number;
};

export const laylineUnderstandExample = {
  input: { distanceToMarkNm: 2, understandDegrees: 10, tackingAngleDeg: 44 },
  output: { understandDistanceNm: 0.4999527395090391 },
} satisfies ToolExample<LaylineUnderstandInput, LaylineUnderstandOutput>;

export const calculateLaylineUnderstand = (
  input: LaylineUnderstandInput,
): LaylineUnderstandOutput => {
  if (input.distanceToMarkNm < 0)
    simpleError(
      "distanceToMarkNm",
      "Distance to the mark cannot be negative.",
      "invalid_distance",
    );
  return {
    understandDistanceNm:
      (input.distanceToMarkNm *
        Math.sin(input.understandDegrees * (Math.PI / 180))) /
      Math.sin(input.tackingAngleDeg * (Math.PI / 180)),
  };
};

export const laylineUnderstandTool = createSimpleTool({
  id: "sailing/layline-understand",
  title: "Understand Distance Calculator",
  description:
    "Compute the distance gained by footing below the layline from the distance to the mark, understand angle, and tacking angle.",
  inputs: [
    {
      description: "Distance from the boat to the mark.",
      id: "distanceToMarkNm",
      kind: "number",
      label: "Distance to mark",
      minimum: 0,
      unit: "nm",
    },
    {
      description: "Angle by which the layline is undershot.",
      id: "understandDegrees",
      kind: "number",
      label: "Understand",
      maximum: 45,
      minimum: 0,
      unit: "\u00B0",
    },
    {
      description: "True wind angle sailed when beating.",
      id: "tackingAngleDeg",
      kind: "number",
      label: "Tacking angle",
      maximum: 89,
      minimum: 20,
      unit: "\u00B0",
    },
  ],
  outputs: [
    {
      description: "Distance gained by understanding the mark.",
      format: "length-nm",
      id: "understandDistanceNm",
      kind: "number",
      label: "Understand distance",
      unit: "nm",
    },
  ],
  calculate: (input) =>
    calculateLaylineUnderstand(input as unknown as LaylineUnderstandInput),
});

export const runLaylineUnderstand = laylineUnderstandTool.execute;
export default laylineUnderstandTool;
