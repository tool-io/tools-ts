import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pageArea: number;
  readonly redactionAreas: readonly number[];
  readonly overlapArea: number;
  readonly pageCount: number;
};
export type Output = {
  readonly redactedUnion: number;
  readonly totalArea: number;
  readonly redactedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pageArea: { type: "number", exclusiveMinimum: 0 },
    redactionAreas: { type: "array", maxItems: 256, items: { type: "number" } },
    overlapArea: { type: "number", minimum: 0 },
    pageCount: { type: "integer", minimum: 1 },
  },
  required: ["pageArea", "redactionAreas", "overlapArea", "pageCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    redactedUnion: { type: "number" },
    totalArea: { type: "number" },
    redactedFraction: { type: "number" },
  },
  required: ["redactedUnion", "totalArea", "redactedFraction"],
} as const;
/** Calculate regulatory dossier redaction area term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pageArea, redactionAreas, overlapArea, pageCount } = request;
  const compute = (): Output => {
    H.positive(pageArea);
    H.integer(pageCount, 1);
    H.domain(
      redactionAreas.every((x) => x >= 0) &&
        overlapArea >= 0 &&
        overlapArea <= redactionAreas.reduce((a, b) => a + b, 0) &&
        redactionAreas.reduce((a, b) => a + b, 0) - overlapArea <=
          pageArea * pageCount,
    );
    return {
      redactedUnion: redactionAreas.reduce((a, b) => a + b, 0) - overlapArea,
      totalArea: pageArea * pageCount,
      redactedFraction:
        (redactionAreas.reduce((a, b) => a + b, 0) - overlapArea) /
        (pageArea * pageCount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pageArea: 100,
    redactionAreas: [20, 15],
    overlapArea: 5,
    pageCount: 2,
  },
  output: { redactedUnion: 30, totalArea: 200, redactedFraction: 0.15 },
} satisfies ToolExample<Input, Output>;
export const regulatoryDossierRedactionAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "regulatory-affairs/regulatory-dossier-redaction-area-term",
    title: "Regulatory Dossier Redaction Area Term Tool",
    description:
      "Calculate regulatory dossier redaction area term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pageArea: { type: "number", exclusiveMinimum: 0 },
        redactionAreas: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        overlapArea: { type: "number", minimum: 0 },
        pageCount: { type: "integer", minimum: 1 },
      },
      required: ["pageArea", "redactionAreas", "overlapArea", "pageCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        redactedUnion: { type: "number" },
        totalArea: { type: "number" },
        redactedFraction: { type: "number" },
      },
      required: ["redactedUnion", "totalArea", "redactedFraction"],
    },
    ports: {
      inputs: [
        {
          id: "pageArea",
          label: "Page Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "redactionAreas",
          label: "Redaction Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "overlapArea",
          label: "Overlap Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pageCount",
          label: "Page Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "redactedUnion",
          label: "Redacted Union",
          valueType: { type: "number" },
        },
        { id: "totalArea", label: "Total Area", valueType: { type: "number" } },
        {
          id: "redactedFraction",
          label: "Redacted Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = regulatoryDossierRedactionAreaTermTool.execute;
export default regulatoryDossierRedactionAreaTermTool;
