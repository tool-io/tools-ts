import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LaylineOverstandInput = {
  readonly distanceToMarkNm: number;
  readonly overstandDegrees: number;
  readonly tackingAngleDeg: number;
};

export type LaylineOverstandOutput = {
  readonly overstandDistanceNm: number;
};

export const laylineOverstandExample = {
  input: { distanceToMarkNm: 2, overstandDegrees: 10, tackingAngleDeg: 44 },
  output: { overstandDistanceNm: 0.4999527395090391 },
} satisfies ToolExample<LaylineOverstandInput, LaylineOverstandOutput>;

export const calculateLaylineOverstand = (
  input: LaylineOverstandInput,
): LaylineOverstandOutput => {
  if (input.distanceToMarkNm < 0)
    simpleError(
      "distanceToMarkNm",
      "Distance to the mark cannot be negative.",
      "invalid_distance",
    );
  return {
    overstandDistanceNm:
      (input.distanceToMarkNm *
        Math.sin(input.overstandDegrees * (Math.PI / 180))) /
      Math.sin(input.tackingAngleDeg * (Math.PI / 180)),
  };
};

export const laylineOverstandTool = createSimpleTool({
  id: "sailing/layline-overstand",
  title: "Overstand Distance Calculator",
  description:
    "Compute the extra distance sailed when overstanding the mark from the distance to the mark, overstand angle, and tacking angle.",
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
      description: "Angle by which the layline is overshot.",
      id: "overstandDegrees",
      kind: "number",
      label: "Overstand",
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
      description: "Additional distance sailed due to overstanding.",
      format: "length-nm",
      id: "overstandDistanceNm",
      kind: "number",
      label: "Overstand distance",
      unit: "nm",
    },
  ],
  calculate: (input) =>
    calculateLaylineOverstand(input as unknown as LaylineOverstandInput),
});

export const runLaylineOverstand = laylineOverstandTool.execute;
export default laylineOverstandTool;
