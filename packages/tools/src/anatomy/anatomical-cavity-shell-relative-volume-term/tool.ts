import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerRadius: number;
  readonly wallThickness: number;
};
export type Output = {
  readonly innerRadius: number;
  readonly cavityFraction: number;
  readonly wallFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerRadius: { type: "number", exclusiveMinimum: 0 },
    wallThickness: { type: "number", minimum: 0 },
  },
  required: ["outerRadius", "wallThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    innerRadius: { type: "number" },
    cavityFraction: { type: "number" },
    wallFraction: { type: "number" },
  },
  required: ["innerRadius", "cavityFraction", "wallFraction"],
} as const;
/** Ideal concentric spherical cavity/wall volume fractions under an explicit uniform thickness approximation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerRadius, wallThickness } = request;
  const compute = (): Output => {
    H.positive(outerRadius);
    H.domain(wallThickness >= 0 && wallThickness <= outerRadius);
    return {
      innerRadius: outerRadius - wallThickness,
      cavityFraction: (1 - wallThickness / outerRadius) ** 3,
      wallFraction: 1 - (1 - wallThickness / outerRadius) ** 3,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outerRadius: 10, wallThickness: 2 },
  output: {
    innerRadius: 8,
    cavityFraction: 0.5120000000000001,
    wallFraction: 0.4879999999999999,
  },
} satisfies ToolExample<Input, Output>;
export const anatomicalCavityShellRelativeVolumeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "anatomy/anatomical-cavity-shell-relative-volume-term",
      title: "Anatomical Cavity Shell Relative Volume Term Tool",
      description:
        "Ideal concentric spherical cavity/wall volume fractions under an explicit uniform thickness approximation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          outerRadius: { type: "number", exclusiveMinimum: 0 },
          wallThickness: { type: "number", minimum: 0 },
        },
        required: ["outerRadius", "wallThickness"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          innerRadius: { type: "number" },
          cavityFraction: { type: "number" },
          wallFraction: { type: "number" },
        },
        required: ["innerRadius", "cavityFraction", "wallFraction"],
      },
      ports: {
        inputs: [
          {
            id: "outerRadius",
            label: "Outer Radius",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "wallThickness",
            label: "Wall Thickness",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "innerRadius",
            label: "Inner Radius",
            valueType: { type: "number" },
          },
          {
            id: "cavityFraction",
            label: "Cavity Fraction",
            valueType: { type: "number" },
          },
          {
            id: "wallFraction",
            label: "Wall Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = anatomicalCavityShellRelativeVolumeTermTool.execute;
export default anatomicalCavityShellRelativeVolumeTermTool;
