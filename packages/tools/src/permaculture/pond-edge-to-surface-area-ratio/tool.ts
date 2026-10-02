import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shorelineLength: number;
  readonly surfaceArea: number;
};
export type Output = { readonly edgePerArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shorelineLength: { type: "number", minimum: 0 },
    surfaceArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["shorelineLength", "surfaceArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { edgePerArea: { type: "number" } },
  required: ["edgePerArea"],
} as const;
/** Calculate pond edge to surface area ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shorelineLength, surfaceArea } = request;
  const compute = (): Output => {
    H.domain(shorelineLength >= 0);
    H.positive(surfaceArea);
    return { edgePerArea: shorelineLength / surfaceArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { shorelineLength: 100, surfaceArea: 500 },
  output: { edgePerArea: 0.2 },
} satisfies ToolExample<Input, Output>;
export const pondEdgeToSurfaceAreaRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/pond-edge-to-surface-area-ratio",
    title: "Pond Edge To Surface Area Ratio Tool",
    description:
      "Calculate pond edge to surface area ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shorelineLength: { type: "number", minimum: 0 },
        surfaceArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["shorelineLength", "surfaceArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { edgePerArea: { type: "number" } },
      required: ["edgePerArea"],
    },
    ports: {
      inputs: [
        {
          id: "shorelineLength",
          label: "Shoreline Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "surfaceArea",
          label: "Surface Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "edgePerArea",
          label: "Edge Per Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pondEdgeToSurfaceAreaRatioTool.execute;
export default pondEdgeToSurfaceAreaRatioTool;
