import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceId: string;
  readonly edition: string;
  readonly earliestYear: number;
  readonly latestYear: number;
  readonly quotedYear: number;
};
export type Output = {
  readonly insideDating: boolean;
  readonly dateWidth: number;
  readonly key: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
    earliestYear: { type: "integer" },
    latestYear: { type: "integer" },
    quotedYear: { type: "integer" },
  },
  required: ["sourceId", "edition", "earliestYear", "latestYear", "quotedYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    insideDating: { type: "boolean" },
    dateWidth: { type: "integer" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["insideDating", "dateWidth", "key"],
} as const;
/** Retain supplied historical dating/edition metadata without verifying historical claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId, edition, earliestYear, latestYear, quotedYear } = request;
  const compute = (): Output => {
    H.domain(
      latestYear >= earliestYear && sourceId.length > 0 && edition.length > 0,
    );
    return {
      insideDating: quotedYear >= earliestYear && quotedYear <= latestYear,
      dateWidth: latestYear - earliestYear,
      key: JSON.stringify([sourceId, edition, earliestYear, latestYear]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceId: "doc-A",
    edition: "2",
    earliestYear: 1800,
    latestYear: 1810,
    quotedYear: 1805,
  },
  output: { insideDating: true, dateWidth: 10, key: '["doc-A","2",1800,1810]' },
} satisfies ToolExample<Input, Output>;
export const naturopathyHistoricalSourceEditionDateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "naturopathy/naturopathy-historical-source-edition-date",
      title: "Naturopathy Historical Source Edition Date Tool",
      description:
        "Retain supplied historical dating/edition metadata without verifying historical claims.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceId: { type: "string", maxLength: 8192 },
          edition: { type: "string", maxLength: 8192 },
          earliestYear: { type: "integer" },
          latestYear: { type: "integer" },
          quotedYear: { type: "integer" },
        },
        required: [
          "sourceId",
          "edition",
          "earliestYear",
          "latestYear",
          "quotedYear",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          insideDating: { type: "boolean" },
          dateWidth: { type: "integer" },
          key: { type: "string", maxLength: 8192 },
        },
        required: ["insideDating", "dateWidth", "key"],
      },
      ports: {
        inputs: [
          {
            id: "sourceId",
            label: "Source Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "edition",
            label: "Edition",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "earliestYear",
            label: "Earliest Year",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "latestYear",
            label: "Latest Year",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "quotedYear",
            label: "Quoted Year",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "insideDating",
            label: "Inside Dating",
            valueType: { type: "boolean" },
          },
          {
            id: "dateWidth",
            label: "Date Width",
            valueType: { type: "integer" },
          },
          { id: "key", label: "Key", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = naturopathyHistoricalSourceEditionDateTool.execute;
export default naturopathyHistoricalSourceEditionDateTool;
