import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elevation: number;
  readonly fittedPlaneElevation: number;
  readonly cellArea: number;
  readonly totalArea: number;
};
export type Output = {
  readonly residual: number;
  readonly squaredAreaWeightedContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elevation: { type: "number" },
    fittedPlaneElevation: { type: "number" },
    cellArea: { type: "number", minimum: 0 },
    totalArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["elevation", "fittedPlaneElevation", "cellArea", "totalArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residual: { type: "number" },
    squaredAreaWeightedContribution: { type: "number" },
  },
  required: ["residual", "squaredAreaWeightedContribution"],
} as const;
/** One weighted squared detrended elevation contribution; a plane fit is supplied rather than estimated. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elevation, fittedPlaneElevation, cellArea, totalArea } = request;
  const compute = (): Output => {
    H.positive(totalArea);
    H.domain(cellArea >= 0 && cellArea <= totalArea);
    return {
      residual: elevation - fittedPlaneElevation,
      squaredAreaWeightedContribution:
        ((elevation - fittedPlaneElevation) ** 2 * cellArea) / totalArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    elevation: 105,
    fittedPlaneElevation: 102,
    cellArea: 4,
    totalArea: 100,
  },
  output: { residual: 3, squaredAreaWeightedContribution: 0.36 },
} satisfies ToolExample<Input, Output>;
export const landsurfaceRoughnessOneCellResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geomorphology/landsurface-roughness-one-cell-residual",
      title: "Landsurface Roughness One Cell Residual Tool",
      description:
        "One weighted squared detrended elevation contribution; a plane fit is supplied rather than estimated.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elevation: { type: "number" },
          fittedPlaneElevation: { type: "number" },
          cellArea: { type: "number", minimum: 0 },
          totalArea: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "elevation",
          "fittedPlaneElevation",
          "cellArea",
          "totalArea",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          residual: { type: "number" },
          squaredAreaWeightedContribution: { type: "number" },
        },
        required: ["residual", "squaredAreaWeightedContribution"],
      },
      ports: {
        inputs: [
          {
            id: "elevation",
            label: "Elevation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fittedPlaneElevation",
            label: "Fitted Plane Elevation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cellArea",
            label: "Cell Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalArea",
            label: "Total Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "residual", label: "Residual", valueType: { type: "number" } },
          {
            id: "squaredAreaWeightedContribution",
            label: "Squared Area Weighted Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = landsurfaceRoughnessOneCellResidualTool.execute;
export default landsurfaceRoughnessOneCellResidualTool;
