import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly thermalEnergy: number;
  readonly viscosity: number;
  readonly radius: number;
};
export type Output = {
  readonly rotationalDiffusivity: number;
  readonly secondRankCorrelationTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    thermalEnergy: { type: "number", exclusiveMinimum: 0 },
    viscosity: { type: "number", exclusiveMinimum: 0 },
    radius: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["thermalEnergy", "viscosity", "radius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rotationalDiffusivity: { type: "number" },
    secondRankCorrelationTime: { type: "number" },
  },
  required: ["rotationalDiffusivity", "secondRankCorrelationTime"],
} as const;
/** No-slip sphere rotational diffusion; second-rank orientational correlation time is 1/(6*Dr). */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { thermalEnergy, viscosity, radius } = request;
  const compute = (): Output => {
    H.positive(thermalEnergy);
    H.positive(viscosity);
    H.positive(radius);
    return {
      rotationalDiffusivity:
        thermalEnergy / (8 * Math.PI * viscosity * radius ** 3),
      secondRankCorrelationTime:
        (8 * Math.PI * viscosity * radius ** 3) / (6 * thermalEnergy),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { thermalEnergy: 25.132741228718345, viscosity: 1, radius: 1 },
  output: {
    rotationalDiffusivity: 1,
    secondRankCorrelationTime: 0.16666666666666666,
  },
} satisfies ToolExample<Input, Output>;
export const rotationalDiffusionViscosityRadiusTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biophysics/rotational-diffusion-viscosity-radius-term",
      title: "Rotational Diffusion Viscosity Radius Term Tool",
      description:
        "No-slip sphere rotational diffusion; second-rank orientational correlation time is 1/(6*Dr).",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          thermalEnergy: { type: "number", exclusiveMinimum: 0 },
          viscosity: { type: "number", exclusiveMinimum: 0 },
          radius: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["thermalEnergy", "viscosity", "radius"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rotationalDiffusivity: { type: "number" },
          secondRankCorrelationTime: { type: "number" },
        },
        required: ["rotationalDiffusivity", "secondRankCorrelationTime"],
      },
      ports: {
        inputs: [
          {
            id: "thermalEnergy",
            label: "Thermal Energy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "viscosity",
            label: "Viscosity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "radius",
            label: "Radius",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "rotationalDiffusivity",
            label: "Rotational Diffusivity",
            valueType: { type: "number" },
          },
          {
            id: "secondRankCorrelationTime",
            label: "Second Rank Correlation Time",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = rotationalDiffusionViscosityRadiusTermTool.execute;
export default rotationalDiffusionViscosityRadiusTermTool;
