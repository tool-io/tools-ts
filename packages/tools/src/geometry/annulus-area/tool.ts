import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const annulusAreaTool = createSimpleTool({
  id: "geometry/annulus-area",
  title: "Annulus Area Calculator",
  description:
    "Calculate the area of an annulus from its outer and inner radii as π(R²−r²).",
  inputs: [
    {
      description: "Outer radius of the ring.",
      id: "outerRadius",
      label: "Outer radius",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      description: "Inner radius of the hole.",
      id: "innerRadius",
      label: "Inner radius",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [{ id: "area", label: "Area", kind: "number" }],
  calculate: (input) => {
    const outer = input.outerRadius as number;
    const inner = input.innerRadius as number;
    if (inner > outer)
      simpleError(
        "innerRadius",
        "The inner radius must not exceed the outer radius.",
        "invalid_radii",
      );
    return {
      area: Math.PI * (outer * outer - inner * inner),
    };
  },
});
export const runAnnulusArea = annulusAreaTool.execute;
export default annulusAreaTool;

export type AnnulusAreaInput = {
  readonly outerRadius: number;
  readonly innerRadius: number;
};

export type AnnulusAreaOutput = {
  readonly area: number;
};

export const annulusAreaExample = {
  input: {
    outerRadius: 1,
    innerRadius: 1,
  },
  output: {
    area: 0,
  },
} satisfies ToolExample<AnnulusAreaInput, AnnulusAreaOutput>;
