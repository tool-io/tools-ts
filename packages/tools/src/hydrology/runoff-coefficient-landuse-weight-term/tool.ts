import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly totalArea: number;
  readonly coefficient: number;
};
export type Output = { readonly weightedCoefficient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    totalArea: { type: "number", exclusiveMinimum: 0 },
    coefficient: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["area", "totalArea", "coefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedCoefficient: { type: "number" } },
  required: ["weightedCoefficient"],
} as const;
/** Calculate runoff coefficient landuse weight term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, totalArea, coefficient } = request;
  const compute = (): Output => {
    H.domain(area >= 0);
    H.positive(totalArea);
    H.domain(area <= totalArea);
    H.probability(coefficient);
    return { weightedCoefficient: (area * coefficient) / totalArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { area: 20, totalArea: 100, coefficient: 0.8 },
  output: { weightedCoefficient: 0.16 },
} satisfies ToolExample<Input, Output>;
export const runoffCoefficientLanduseWeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/runoff-coefficient-landuse-weight-term",
    title: "Runoff Coefficient Landuse Weight Term Tool",
    description:
      "Calculate runoff coefficient landuse weight term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        totalArea: { type: "number", exclusiveMinimum: 0 },
        coefficient: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["area", "totalArea", "coefficient"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weightedCoefficient: { type: "number" } },
      required: ["weightedCoefficient"],
    },
    ports: {
      inputs: [
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalArea",
          label: "Total Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedCoefficient",
          label: "Weighted Coefficient",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = runoffCoefficientLanduseWeightTermTool.execute;
export default runoffCoefficientLanduseWeightTermTool;
