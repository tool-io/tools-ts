import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly liquidDensity: number;
  readonly freeSurfaceSecondMoment: number;
  readonly displacementMass: number;
};
export type Output = { readonly metacentricReduction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    liquidDensity: { type: "number", minimum: 0 },
    freeSurfaceSecondMoment: { type: "number", minimum: 0 },
    displacementMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["liquidDensity", "freeSurfaceSecondMoment", "displacementMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { metacentricReduction: { type: "number" } },
  required: ["metacentricReduction"],
} as const;
/** Compute the small-angle free-surface metacentric-height reduction from explicit hydrostatic inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { liquidDensity, freeSurfaceSecondMoment, displacementMass } = request;
  const compute = (): Output => {
    H.domain(liquidDensity >= 0 && freeSurfaceSecondMoment >= 0);
    H.positive(displacementMass);
    return {
      metacentricReduction:
        (liquidDensity * freeSurfaceSecondMoment) / displacementMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    liquidDensity: 1000,
    freeSurfaceSecondMoment: 20,
    displacementMass: 100000,
  },
  output: { metacentricReduction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const ballastTankFreeSurfaceCorrectionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "nautical/ballast-tank-free-surface-correction-term",
      title: "Ballast Tank Free Surface Correction Term Tool",
      description:
        "Compute the small-angle free-surface metacentric-height reduction from explicit hydrostatic inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          liquidDensity: { type: "number", minimum: 0 },
          freeSurfaceSecondMoment: { type: "number", minimum: 0 },
          displacementMass: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "liquidDensity",
          "freeSurfaceSecondMoment",
          "displacementMass",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { metacentricReduction: { type: "number" } },
        required: ["metacentricReduction"],
      },
      ports: {
        inputs: [
          {
            id: "liquidDensity",
            label: "Liquid Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "freeSurfaceSecondMoment",
            label: "Free Surface Second Moment",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "displacementMass",
            label: "Displacement Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "metacentricReduction",
            label: "Metacentric Reduction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ballastTankFreeSurfaceCorrectionTermTool.execute;
export default ballastTankFreeSurfaceCorrectionTermTool;
