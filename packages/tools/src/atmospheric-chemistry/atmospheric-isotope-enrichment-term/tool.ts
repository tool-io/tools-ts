import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleRatio: number;
  readonly referenceRatio: number;
};
export type Output = {
  readonly fractionalEnrichment: number;
  readonly perMilEnrichment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleRatio: { type: "number", minimum: 0 },
    referenceRatio: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sampleRatio", "referenceRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fractionalEnrichment: { type: "number" },
    perMilEnrichment: { type: "number" },
  },
  required: ["fractionalEnrichment", "perMilEnrichment"],
} as const;
/** Calculate isotope-ratio enrichment relative to an explicit positive reference ratio as a fraction and per mil. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleRatio, referenceRatio } = request;
  const compute = (): Output => {
    H.domain(sampleRatio >= 0, "sampleRatio");
    (H.domain(
      Number.isFinite(referenceRatio) && referenceRatio > 0,
      "referenceRatio",
    ),
      referenceRatio);
    return {
      fractionalEnrichment: sampleRatio / referenceRatio - 1,
      perMilEnrichment: (sampleRatio / referenceRatio - 1) * 1000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleRatio: 0.012, referenceRatio: 0.01 },
  output: {
    fractionalEnrichment: 0.19999999999999996,
    perMilEnrichment: 199.99999999999994,
  },
} satisfies ToolExample<Input, Output>;
export const atmosphericIsotopeEnrichmentTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-chemistry", "atmospheric chemistry", "chemistry"],
      keywords: ["atmospheric chemistry", "chemistry"],
    },
    id: "atmospheric-chemistry/atmospheric-isotope-enrichment-term",
    title: "Atmospheric Isotope Enrichment Term",
    description:
      "Calculate isotope-ratio enrichment relative to an explicit positive reference ratio as a fraction and per mil.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleRatio: { type: "number", minimum: 0 },
        referenceRatio: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sampleRatio", "referenceRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fractionalEnrichment: { type: "number" },
        perMilEnrichment: { type: "number" },
      },
      required: ["fractionalEnrichment", "perMilEnrichment"],
    },
    ports: {
      inputs: [
        {
          id: "sampleRatio",
          label: "Sample Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceRatio",
          label: "Reference Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fractionalEnrichment",
          label: "Fractional Enrichment",
          valueType: { type: "number" },
        },
        {
          id: "perMilEnrichment",
          label: "Per Mil Enrichment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = atmosphericIsotopeEnrichmentTermTool.execute;
export default atmosphericIsotopeEnrichmentTermTool;
