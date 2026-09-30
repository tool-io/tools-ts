import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowHeight: number;
  readonly highHeight: number;
  readonly distanceFromLow: number;
  readonly contourDistance: number;
};
export type Output = { readonly height: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowHeight: { type: "number" },
    highHeight: { type: "number" },
    distanceFromLow: { type: "number", minimum: 0 },
    contourDistance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["lowHeight", "highHeight", "distanceFromLow", "contourDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { height: { type: "number" } },
  required: ["height"],
} as const;
/** Calculate landscape contour spot height interpolation from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowHeight, highHeight, distanceFromLow, contourDistance } = request;
  const compute = (): Output => {
    H.positive(contourDistance);
    H.domain(distanceFromLow >= 0 && distanceFromLow <= contourDistance);
    return {
      height:
        lowHeight +
        ((highHeight - lowHeight) * distanceFromLow) / contourDistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lowHeight: 100,
    highHeight: 105,
    distanceFromLow: 4,
    contourDistance: 10,
  },
  output: { height: 102 },
} satisfies ToolExample<Input, Output>;
export const landscapeContourSpotHeightInterpolationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "landscape-architecture/landscape-contour-spot-height-interpolation",
      title: "Landscape Contour Spot Height Interpolation Tool",
      description:
        "Calculate landscape contour spot height interpolation from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lowHeight: { type: "number" },
          highHeight: { type: "number" },
          distanceFromLow: { type: "number", minimum: 0 },
          contourDistance: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "lowHeight",
          "highHeight",
          "distanceFromLow",
          "contourDistance",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { height: { type: "number" } },
        required: ["height"],
      },
      ports: {
        inputs: [
          {
            id: "lowHeight",
            label: "Low Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "highHeight",
            label: "High Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "distanceFromLow",
            label: "Distance From Low",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "contourDistance",
            label: "Contour Distance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "height", label: "Height", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = landscapeContourSpotHeightInterpolationTool.execute;
export default landscapeContourSpotHeightInterpolationTool;
