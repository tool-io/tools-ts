import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly series: string;
  readonly issueNumber: number;
  readonly publicationDate: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    series: { type: "string", maxLength: 8192, enum: ["L", "C"] },
    issueNumber: { type: "integer", minimum: 1 },
    publicationDate: { type: "string", maxLength: 8192 },
  },
  required: ["series", "issueNumber", "publicationDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format a supplied legacy numbered Official Journal L or C issue reference; this does not resolve newer act-based publication references. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { series, issueNumber, publicationDate } = request;
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
    H.domain(["L", "C"].includes(series), "series");
    (H.domain(
      Number.isSafeInteger(issueNumber) &&
        issueNumber >= 1 &&
        issueNumber <= Number.MAX_SAFE_INTEGER,
      "issueNumber",
    ),
      issueNumber);
    namedDate(publicationDate, "publicationDate");
    return {
      label: "OJ " + series + " " + issueNumber + ", " + publicationDate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { series: "L", issueNumber: 119, publicationDate: "2016-05-04" },
  output: { label: "OJ L 119, 2016-05-04" },
} satisfies ToolExample<Input, Output>;
export const europeanGazetteOjSeriesLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "european-studies/european-gazette-oj-series-label",
    title: "European Gazette Oj Series Label Tool",
    description:
      "Format a supplied legacy numbered Official Journal L or C issue reference; this does not resolve newer act-based publication references.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        series: { type: "string", maxLength: 8192, enum: ["L", "C"] },
        issueNumber: { type: "integer", minimum: 1 },
        publicationDate: { type: "string", maxLength: 8192 },
      },
      required: ["series", "issueNumber", "publicationDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "series",
          label: "Series",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "issueNumber",
          label: "Issue Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "publicationDate",
          label: "Publication Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = europeanGazetteOjSeriesLabelTool.execute;
export default europeanGazetteOjSeriesLabelTool;
