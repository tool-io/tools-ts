import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampledArea: number;
  readonly totalArea: number;
};
export type Output = { readonly fraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampledArea: { type: "number", minimum: 0 },
    totalArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sampledArea", "totalArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" } },
  required: ["fraction"],
} as const;
/** Calculate object surface sampling fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampledArea, totalArea } = request;
  const compute = (): Output => {
    H.positive(totalArea);
    H.domain(sampledArea >= 0 && sampledArea <= totalArea);
    return { fraction: sampledArea / totalArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampledArea: 12, totalArea: 100 },
  output: { fraction: 0.12 },
} satisfies ToolExample<Input, Output>;
export const objectSurfaceSamplingFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/object-surface-sampling-fraction",
    title: "Object Surface Sampling Fraction Tool",
    description:
      "Calculate object surface sampling fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampledArea: { type: "number", minimum: 0 },
        totalArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sampledArea", "totalArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fraction: { type: "number" } },
      required: ["fraction"],
    },
    ports: {
      inputs: [
        {
          id: "sampledArea",
          label: "Sampled Area",
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
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = objectSurfaceSamplingFractionTool.execute;
export default objectSurfaceSamplingFractionTool;
