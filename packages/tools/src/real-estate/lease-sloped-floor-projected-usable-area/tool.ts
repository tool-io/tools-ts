import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slopedArea: number;
  readonly angle: number;
  readonly excludedProjectedArea: number;
};
export type Output = {
  readonly projectedArea: number;
  readonly usableProjectedArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slopedArea: { type: "number", minimum: 0 },
    angle: { type: "number", minimum: 0 },
    excludedProjectedArea: { type: "number", minimum: 0 },
  },
  required: ["slopedArea", "angle", "excludedProjectedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projectedArea: { type: "number" },
    usableProjectedArea: { type: "number" },
  },
  required: ["projectedArea", "usableProjectedArea"],
} as const;
/** Calculate lease sloped floor projected usable area from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slopedArea, angle, excludedProjectedArea } = request;
  const compute = (): Output => {
    H.domain(
      slopedArea >= 0 &&
        angle >= 0 &&
        angle < Math.PI / 2 &&
        excludedProjectedArea >= 0 &&
        excludedProjectedArea <= slopedArea * Math.cos(angle),
    );
    return {
      projectedArea: slopedArea * Math.cos(angle),
      usableProjectedArea: slopedArea * Math.cos(angle) - excludedProjectedArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    slopedArea: 100,
    angle: 1.0471975511965976,
    excludedProjectedArea: 10,
  },
  output: {
    projectedArea: 50.000000000000014,
    usableProjectedArea: 40.000000000000014,
  },
} satisfies ToolExample<Input, Output>;
export const leaseSlopedFloorProjectedUsableAreaTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "real-estate/lease-sloped-floor-projected-usable-area",
      title: "Lease Sloped Floor Projected Usable Area Tool",
      description:
        "Calculate lease sloped floor projected usable area from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          slopedArea: { type: "number", minimum: 0 },
          angle: { type: "number", minimum: 0 },
          excludedProjectedArea: { type: "number", minimum: 0 },
        },
        required: ["slopedArea", "angle", "excludedProjectedArea"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          projectedArea: { type: "number" },
          usableProjectedArea: { type: "number" },
        },
        required: ["projectedArea", "usableProjectedArea"],
      },
      ports: {
        inputs: [
          {
            id: "slopedArea",
            label: "Sloped Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "angle",
            label: "Angle",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "excludedProjectedArea",
            label: "Excluded Projected Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "projectedArea",
            label: "Projected Area",
            valueType: { type: "number" },
          },
          {
            id: "usableProjectedArea",
            label: "Usable Projected Area",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = leaseSlopedFloorProjectedUsableAreaTool.execute;
export default leaseSlopedFloorProjectedUsableAreaTool;
