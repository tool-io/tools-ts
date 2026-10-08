import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinateDifferences: readonly number[];
  readonly suppliedSquaredDistance: number;
};
export type Output = {
  readonly calculatedSquaredDistance: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinateDifferences: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    suppliedSquaredDistance: { type: "number", minimum: 0 },
  },
  required: ["coordinateDifferences", "suppliedSquaredDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calculatedSquaredDistance: { type: "number" },
    residual: { type: "number" },
  },
  required: ["calculatedSquaredDistance", "residual"],
} as const;
/** Compare an explicitly supplied squared distance with the squared Euclidean norm of supplied coordinate differences. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinateDifferences, suppliedSquaredDistance } = request;
  const compute = (): Output => {
    H.domain(suppliedSquaredDistance >= 0, "suppliedSquaredDistance");
    return (() => {
      const norm = Math.hypot(...coordinateDifferences);
      const calculatedSquaredDistance = norm * norm;
      return {
        calculatedSquaredDistance,
        residual: suppliedSquaredDistance - calculatedSquaredDistance,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinateDifferences: [3, 4], suppliedSquaredDistance: 26 },
  output: { calculatedSquaredDistance: 25, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const vectorDistanceSquaredNormCrosscheckTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["distance", "mathematics"],
        keywords: ["distance", "mathematics"],
      },
      id: "distance/vector-distance-squared-norm-crosscheck",
      title: "Vector Distance Squared Norm Crosscheck",
      description:
        "Compare an explicitly supplied squared distance with the squared Euclidean norm of supplied coordinate differences.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coordinateDifferences: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          suppliedSquaredDistance: { type: "number", minimum: 0 },
        },
        required: ["coordinateDifferences", "suppliedSquaredDistance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          calculatedSquaredDistance: { type: "number" },
          residual: { type: "number" },
        },
        required: ["calculatedSquaredDistance", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "coordinateDifferences",
            label: "Coordinate Differences",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "suppliedSquaredDistance",
            label: "Supplied Squared Distance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "calculatedSquaredDistance",
            label: "Calculated Squared Distance",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = vectorDistanceSquaredNormCrosscheckTool.execute;
export default vectorDistanceSquaredNormCrosscheckTool;
