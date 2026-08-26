import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StainDilutionInput = {
  readonly stainParts: number;
  readonly stainVolumeL: number;
  readonly thinnerParts: number;
};

export type StainDilutionOutput = {
  readonly dilutionRatio: number;
  readonly dilutedVolumeL: number;
};

export const stainDilutionExample = {
  input: { stainParts: 3, stainVolumeL: 2, thinnerParts: 1 },
  output: {
    dilutionRatio: 0.3333333333333333,
    dilutedVolumeL: 2.6666666666666665,
  },
} satisfies ToolExample<StainDilutionInput, StainDilutionOutput>;

export const stainDilutionTool = createSimpleTool({
  id: "carpentry/beize-verduennung-verhaeltnis",
  title: "Stain Dilution Ratio Calculator",
  description:
    "Calculate the thinner-to-stain dilution ratio and the resulting diluted volume.",
  inputs: [
    {
      id: "stainParts",
      kind: "number",
      label: "Stain parts",
    },
    {
      id: "thinnerParts",
      kind: "number",
      label: "Thinner parts",
      minimum: 0,
    },
    {
      id: "stainVolumeL",
      kind: "number",
      label: "Stain volume",
      unit: "l",
    },
  ],
  outputs: [
    {
      id: "dilutionRatio",
      kind: "number",
      label: "Dilution ratio",
    },
    {
      id: "dilutedVolumeL",
      kind: "number",
      label: "Diluted volume",
      unit: "l",
    },
  ],
  calculate: (input) => {
    const stainParts = input.stainParts as number;
    const thinnerParts = input.thinnerParts as number;
    const stainVolumeL = input.stainVolumeL as number;
    if (!(stainParts > 0))
      simpleError(
        "stainParts",
        "Stain parts must be greater than zero.",
        "invalid_stain_parts",
      );
    if (!(stainVolumeL > 0))
      simpleError(
        "stainVolumeL",
        "Stain volume must be greater than zero.",
        "invalid_stain_volume",
      );
    const dilutionRatio = thinnerParts / stainParts;
    return {
      dilutionRatio,
      dilutedVolumeL: stainVolumeL * (1 + dilutionRatio),
    };
  },
});
export const runStainDilution = stainDilutionTool.execute;
export default stainDilutionTool;
