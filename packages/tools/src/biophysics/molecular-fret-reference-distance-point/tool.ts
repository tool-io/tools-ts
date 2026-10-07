import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly forsterRadius: number;
};
export type Output = { readonly transferEfficiency: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    forsterRadius: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["distance", "forsterRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { transferEfficiency: { type: "number" } },
  required: ["transferEfficiency"],
} as const;
/** Calculate ideal single-distance Förster transfer efficiency using an explicit positive Förster radius and sixth-power distance law. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, forsterRadius } = request;
  const compute = (): Output => {
    H.domain(distance >= 0, "distance");
    (H.domain(
      Number.isFinite(forsterRadius) && forsterRadius > 0,
      "forsterRadius",
    ),
      forsterRadius);
    return {
      transferEfficiency: 1 / (1 + Math.pow(distance / forsterRadius, 6)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 5, forsterRadius: 5 },
  output: { transferEfficiency: 0.5 },
} satisfies ToolExample<Input, Output>;
export const molecularFretReferenceDistancepointTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["biophysics", "physics"],
        keywords: ["biophysics", "physics"],
      },
      id: "biophysics/molecular-fret-reference-distance-point",
      title: "Molecular FRET Reference Distance Point",
      description:
        "Calculate ideal single-distance Förster transfer efficiency using an explicit positive Förster radius and sixth-power distance law.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          distance: { type: "number", minimum: 0 },
          forsterRadius: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["distance", "forsterRadius"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { transferEfficiency: { type: "number" } },
        required: ["transferEfficiency"],
      },
      ports: {
        inputs: [
          {
            id: "distance",
            label: "Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "forsterRadius",
            label: "Forster Radius",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "transferEfficiency",
            label: "Transfer Efficiency",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = molecularFretReferenceDistancepointTool.execute;
export default molecularFretReferenceDistancepointTool;
