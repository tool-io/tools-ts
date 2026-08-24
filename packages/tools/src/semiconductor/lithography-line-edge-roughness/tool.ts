import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type LineEdgeRoughnessInput = {
  readonly doseVariationPercent: number;
  readonly sensitivityNmPerPercent: number;
};

export type LineEdgeRoughnessOutput = {
  readonly lerThreeSigmaNm: number;
};

export const lineEdgeRoughnessExample = {
  input: { doseVariationPercent: 5, sensitivityNmPerPercent: 1 },
  output: { lerThreeSigmaNm: 5 },
} satisfies ToolExample<LineEdgeRoughnessInput, LineEdgeRoughnessOutput>;

export const lineEdgeRoughnessTool = createSimpleTool({
  calculate: (input) => ({
    lerThreeSigmaNm:
      (input.sensitivityNmPerPercent as number) *
      (input.doseVariationPercent as number),
  }),
  description:
    "Estimate 3-sigma line edge roughness as dose sensitivity in nanometers per percent times dose variation percent, using a documented heuristic.",
  id: "semiconductor/lithography-line-edge-roughness",
  inputs: [
    {
      description: "Exposure dose variation driving roughness.",
      id: "doseVariationPercent",
      kind: "number",
      label: "Dose variation",
      minimum: 0,
      unit: "%",
    },
    {
      description:
        "Line edge roughness sensitivity to dose, documented heuristic factor.",
      id: "sensitivityNmPerPercent",
      kind: "number",
      label: "LER sensitivity",
      minimum: 0,
      unit: "nm/%",
    },
  ],
  outputs: [
    {
      description: "Estimated three-sigma line edge roughness.",
      id: "lerThreeSigmaNm",
      kind: "number",
      label: "3-sigma LER",
      minimum: 0,
      unit: "nm",
    },
  ],
  title: "Line Edge Roughness Estimator",
});
export const runLineEdgeRoughness = lineEdgeRoughnessTool.execute;
export default lineEdgeRoughnessTool;
