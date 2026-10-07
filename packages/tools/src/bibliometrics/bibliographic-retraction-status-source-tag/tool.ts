import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workId: string;
  readonly status: string;
  readonly source: string;
  readonly asOfDate: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workId: { type: "string", maxLength: 8192, minLength: 1 },
    status: {
      type: "string",
      maxLength: 8192,
      enum: [
        "not-recorded",
        "retracted",
        "expression-of-concern",
        "corrected",
        "unknown",
      ],
    },
    source: { type: "string", maxLength: 8192, minLength: 1 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["workId", "status", "source", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label explicitly sourced bibliographic status metadata and its as-of date without determining whether a work is retracted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workId, status, source, asOfDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    H.domain(workId.length > 0 && source.length > 0, "workId");
    H.domain(
      [
        "not-recorded",
        "retracted",
        "expression-of-concern",
        "corrected",
        "unknown",
      ].includes(status),
      "status",
    );
    namedDate(asOfDate, "asOfDate");
    return {
      tag: workId + " [" + status + "; " + source + "; as of " + asOfDate + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    workId: "W17",
    status: "retracted",
    source: "publisher notice",
    asOfDate: "2026-11-01",
  },
  output: { tag: "W17 [retracted; publisher notice; as of 2026-11-01]" },
} satisfies ToolExample<Input, Output>;
export const bibliographicRetractionStatusSourceTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["bibliometrics", "research and quality management"],
        keywords: ["bibliometrics", "research and quality management"],
      },
      id: "bibliometrics/bibliographic-retraction-status-source-tag",
      title: "Bibliographic Retraction Status Source Tag",
      description:
        "Label explicitly sourced bibliographic status metadata and its as-of date without determining whether a work is retracted.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          workId: { type: "string", maxLength: 8192, minLength: 1 },
          status: {
            type: "string",
            maxLength: 8192,
            enum: [
              "not-recorded",
              "retracted",
              "expression-of-concern",
              "corrected",
              "unknown",
            ],
          },
          source: { type: "string", maxLength: 8192, minLength: 1 },
          asOfDate: { type: "string", maxLength: 8192 },
        },
        required: ["workId", "status", "source", "asOfDate"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { tag: { type: "string", maxLength: 8192 } },
        required: ["tag"],
      },
      ports: {
        inputs: [
          {
            id: "workId",
            label: "Work Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "status",
            label: "Status",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "source",
            label: "Source",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "asOfDate",
            label: "As Of Date",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
      },
    },
    calculate,
  });
export const run = bibliographicRetractionStatusSourceTagTool.execute;
export default bibliographicRetractionStatusSourceTagTool;
