import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MetacentricHeightInput = {
  readonly buoyancyToMetacenterFeet: number;
  readonly keelToCenterBuoyancyFeet: number;
  readonly keelToCenterGravityFeet: number;
};

export type MetacentricHeightOutput = {
  readonly metacentricHeightFeet: number;
};

export const metacentricHeightExample = {
  input: {
    buoyancyToMetacenterFeet: 2,
    keelToCenterBuoyancyFeet: 3,
    keelToCenterGravityFeet: 4,
  },
  output: { metacentricHeightFeet: 1 },
} satisfies ToolExample<MetacentricHeightInput, MetacentricHeightOutput>;

export const metacentricHeightTool = createSimpleTool({
  calculate: (input) => {
    const buoyancyToMetacenterFeet = input.buoyancyToMetacenterFeet as number;
    const keelToCenterBuoyancyFeet = input.keelToCenterBuoyancyFeet as number;
    const keelToCenterGravityFeet = input.keelToCenterGravityFeet as number;
    if (keelToCenterBuoyancyFeet <= 0)
      simpleError(
        "keelToCenterBuoyancyFeet",
        "KB must be positive.",
        "invalid_input",
      );
    if (buoyancyToMetacenterFeet <= 0)
      simpleError(
        "buoyancyToMetacenterFeet",
        "BM must be positive.",
        "invalid_input",
      );
    if (keelToCenterGravityFeet <= 0)
      simpleError(
        "keelToCenterGravityFeet",
        "KG must be positive.",
        "invalid_input",
      );
    return {
      metacentricHeightFeet:
        keelToCenterBuoyancyFeet +
        buoyancyToMetacenterFeet -
        keelToCenterGravityFeet,
    };
  },
  description:
    "Compute the metacentric height using metacentricHeightFeet = keelToCenterBuoyancyFeet + buoyancyToMetacenterFeet - keelToCenterGravityFeet (GM = KB + BM - KG).",
  id: "sailing/metacentric-height",
  inputs: [
    {
      description: "Vertical distance from keel to center of buoyancy.",
      id: "keelToCenterBuoyancyFeet",
      kind: "number",
      label: "KB",
      unit: "ft",
    },
    {
      description: "Vertical distance from center of buoyancy to metacenter.",
      id: "buoyancyToMetacenterFeet",
      kind: "number",
      label: "BM",
      unit: "ft",
    },
    {
      description: "Vertical distance from keel to center of gravity.",
      id: "keelToCenterGravityFeet",
      kind: "number",
      label: "KG",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description:
        "Metacentric height GM; negative values indicate unstable equilibrium.",
      format: "length-ft",
      id: "metacentricHeightFeet",
      kind: "number",
      label: "Metacentric height",
      unit: "ft",
    },
  ],
  title: "Metacentric Height Calculator",
});
export const runMetacentricHeight = metacentricHeightTool.execute;
export default metacentricHeightTool;
