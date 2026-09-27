import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleElement: number;
  readonly sampleNormalizer: number;
  readonly referenceElement: number;
  readonly referenceNormalizer: number;
};
export type Output = {
  readonly sampleRatio: number;
  readonly referenceRatio: number;
  readonly enrichmentFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleElement: { type: "number", minimum: 0 },
    sampleNormalizer: { type: "number", exclusiveMinimum: 0 },
    referenceElement: { type: "number", exclusiveMinimum: 0 },
    referenceNormalizer: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "sampleElement",
    "sampleNormalizer",
    "referenceElement",
    "referenceNormalizer",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleRatio: { type: "number" },
    referenceRatio: { type: "number" },
    enrichmentFactor: { type: "number" },
  },
  required: ["sampleRatio", "referenceRatio", "enrichmentFactor"],
} as const;
/** Calculate element enrichment reference ratio term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sampleElement,
    sampleNormalizer,
    referenceElement,
    referenceNormalizer,
  } = request;
  const compute = (): Output => {
    H.domain(sampleElement >= 0);
    H.positive(sampleNormalizer);
    H.positive(referenceElement);
    H.positive(referenceNormalizer);
    return {
      sampleRatio: sampleElement / sampleNormalizer,
      referenceRatio: referenceElement / referenceNormalizer,
      enrichmentFactor:
        (sampleElement * referenceNormalizer) /
        (sampleNormalizer * referenceElement),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleElement: 20,
    sampleNormalizer: 10,
    referenceElement: 5,
    referenceNormalizer: 5,
  },
  output: { sampleRatio: 2, referenceRatio: 1, enrichmentFactor: 2 },
} satisfies ToolExample<Input, Output>;
export const elementEnrichmentReferenceRatioTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geochemistry/element-enrichment-reference-ratio-term",
      title: "Element Enrichment Reference Ratio Term Tool",
      description:
        "Calculate element enrichment reference ratio term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampleElement: { type: "number", minimum: 0 },
          sampleNormalizer: { type: "number", exclusiveMinimum: 0 },
          referenceElement: { type: "number", exclusiveMinimum: 0 },
          referenceNormalizer: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "sampleElement",
          "sampleNormalizer",
          "referenceElement",
          "referenceNormalizer",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampleRatio: { type: "number" },
          referenceRatio: { type: "number" },
          enrichmentFactor: { type: "number" },
        },
        required: ["sampleRatio", "referenceRatio", "enrichmentFactor"],
      },
      ports: {
        inputs: [
          {
            id: "sampleElement",
            label: "Sample Element",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sampleNormalizer",
            label: "Sample Normalizer",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceElement",
            label: "Reference Element",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceNormalizer",
            label: "Reference Normalizer",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "sampleRatio",
            label: "Sample Ratio",
            valueType: { type: "number" },
          },
          {
            id: "referenceRatio",
            label: "Reference Ratio",
            valueType: { type: "number" },
          },
          {
            id: "enrichmentFactor",
            label: "Enrichment Factor",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = elementEnrichmentReferenceRatioTermTool.execute;
export default elementEnrichmentReferenceRatioTermTool;
