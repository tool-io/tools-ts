import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pageArea: number;
  readonly disjointRedactions: readonly number[];
};
export type Output = {
  readonly redactedArea: number;
  readonly releasedArea: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pageArea: { type: "number", exclusiveMinimum: 0 },
    disjointRedactions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["pageArea", "disjointRedactions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    redactedArea: { type: "number" },
    releasedArea: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["redactedArea", "releasedArea", "fraction"],
} as const;
/** Area arithmetic for explicitly disjoint redactions; does not infer disclosure exemptions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pageArea, disjointRedactions } = request;
  const compute = (): Output => {
    H.positive(pageArea);
    H.domain(
      disjointRedactions.every((x) => x >= 0) &&
        disjointRedactions.reduce((a, b) => a + b, 0) <= pageArea,
    );
    return {
      redactedArea: disjointRedactions.reduce((a, b) => a + b, 0),
      releasedArea: pageArea - disjointRedactions.reduce((a, b) => a + b, 0),
      fraction: disjointRedactions.reduce((a, b) => a + b, 0) / pageArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pageArea: 100, disjointRedactions: [10, 20] },
  output: { redactedArea: 30, releasedArea: 70, fraction: 0.3 },
} satisfies ToolExample<Input, Output>;
export const publicRecordPartialPageRedactionAreaTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-administration/public-record-partial-page-redaction-area",
      title: "Public Record Partial Page Redaction Area Tool",
      description:
        "Area arithmetic for explicitly disjoint redactions; does not infer disclosure exemptions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pageArea: { type: "number", exclusiveMinimum: 0 },
          disjointRedactions: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["pageArea", "disjointRedactions"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          redactedArea: { type: "number" },
          releasedArea: { type: "number" },
          fraction: { type: "number" },
        },
        required: ["redactedArea", "releasedArea", "fraction"],
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
            id: "disjointRedactions",
            label: "Disjoint Redactions",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "redactedArea",
            label: "Redacted Area",
            valueType: { type: "number" },
          },
          {
            id: "releasedArea",
            label: "Released Area",
            valueType: { type: "number" },
          },
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = publicRecordPartialPageRedactionAreaTool.execute;
export default publicRecordPartialPageRedactionAreaTool;
