import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleDensity: number;
  readonly suppliedReferenceDensity: number;
};
export type Output = { readonly relativeDensity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleDensity: { type: "number", minimum: 0 },
    suppliedReferenceDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sampleDensity", "suppliedReferenceDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeDensity: { type: "number" } },
  required: ["relativeDensity"],
} as const;
/** Divide explicit sample density by a supplied positive compatible reference density without assuming a reference temperature. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleDensity, suppliedReferenceDensity } = request;
  const compute = (): Output => {
    H.domain(sampleDensity >= 0, "sampleDensity");
    (H.domain(suppliedReferenceDensity > 0, "suppliedReferenceDensity"),
      suppliedReferenceDensity);
    return { relativeDensity: sampleDensity / suppliedReferenceDensity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleDensity: 800, suppliedReferenceDensity: 1000 },
  output: { relativeDensity: 0.8 },
} satisfies ToolExample<Input, Output>;
export const densityReferenceRelativeSpecificGravityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["encode-decode"],
        fields: ["convert", "unit conversion", "computer science"],
        keywords: ["unit conversion", "computer science"],
      },
      id: "convert/density-reference-relative-specific-gravity",
      title: "Density Reference Relative Specific Gravity",
      description:
        "Divide explicit sample density by a supplied positive compatible reference density without assuming a reference temperature.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampleDensity: { type: "number", minimum: 0 },
          suppliedReferenceDensity: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["sampleDensity", "suppliedReferenceDensity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { relativeDensity: { type: "number" } },
        required: ["relativeDensity"],
      },
      ports: {
        inputs: [
          {
            id: "sampleDensity",
            label: "Sample Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedReferenceDensity",
            label: "Supplied Reference Density",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "relativeDensity",
            label: "Relative Density",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = densityReferenceRelativeSpecificGravityTool.execute;
export default densityReferenceRelativeSpecificGravityTool;
