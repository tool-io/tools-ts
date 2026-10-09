import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseX: number;
  readonly baseY: number;
  readonly sideX: number;
  readonly sideY: number;
};
export type Output = { readonly leftPositiveHeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseX: { type: "number" },
    baseY: { type: "number" },
    sideX: { type: "number" },
    sideY: { type: "number" },
  },
  required: ["baseX", "baseY", "sideX", "sideY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { leftPositiveHeight: { type: "number" } },
  required: ["leftPositiveHeight"],
} as const;
/** Calculate signed parallelogram height from explicit planar vectors, using left of the directed base as positive. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseX, baseY, sideX, sideY } = request;
  const compute = (): Output => {
    H.domain(baseX !== 0 || baseY !== 0, "baseX");
    return {
      leftPositiveHeight:
        (baseX * sideY - baseY * sideX) / Math.hypot(baseX, baseY),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseX: 4, baseY: 0, sideX: 1, sideY: 3 },
  output: { leftPositiveHeight: 3 },
} satisfies ToolExample<Input, Output>;
export const parallelogramSignedHeightFromCrossProductTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["geometry", "mathematics"],
        keywords: ["geometry", "mathematics"],
      },
      id: "geometry/parallelogram-signed-height-from-cross-product",
      title: "Parallelogram Signed Height From Cross Product",
      description:
        "Calculate signed parallelogram height from explicit planar vectors, using left of the directed base as positive.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baseX: { type: "number" },
          baseY: { type: "number" },
          sideX: { type: "number" },
          sideY: { type: "number" },
        },
        required: ["baseX", "baseY", "sideX", "sideY"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { leftPositiveHeight: { type: "number" } },
        required: ["leftPositiveHeight"],
      },
      ports: {
        inputs: [
          {
            id: "baseX",
            label: "Base X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "baseY",
            label: "Base Y",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sideX",
            label: "Side X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sideY",
            label: "Side Y",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "leftPositiveHeight",
            label: "Left Positive Height",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = parallelogramSignedHeightFromCrossProductTool.execute;
export default parallelogramSignedHeightFromCrossProductTool;
