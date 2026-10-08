import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly authorityCode: string;
  readonly placeId: string;
  readonly asOfDate: string;
};
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authorityCode: { type: "string", maxLength: 8192, minLength: 1 },
    placeId: { type: "string", maxLength: 8192, minLength: 1 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["authorityCode", "placeId", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Encode explicit gazetteer authority, place ID and as-of date fields without resolving historical place membership. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { authorityCode, placeId, asOfDate } = request;
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
    H.domain(authorityCode.length > 0 && placeId.length > 0, "authorityCode");
    namedDate(asOfDate, "asOfDate");
    return { key: JSON.stringify([authorityCode, placeId, asOfDate]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { authorityCode: "G-A", placeId: "P17", asOfDate: "1920-01-01" },
  output: { key: '["G-A","P17","1920-01-01"]' },
} satisfies ToolExample<Input, Output>;
export const historicalGazetteerAsOfKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["digital-humanities", "digital humanities", "humanities"],
      keywords: ["digital humanities", "humanities"],
    },
    id: "digital-humanities/historical-gazetteer-as-of-key",
    title: "Historical Gazetteer As Of Key",
    description:
      "Encode explicit gazetteer authority, place ID and as-of date fields without resolving historical place membership.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        authorityCode: { type: "string", maxLength: 8192, minLength: 1 },
        placeId: { type: "string", maxLength: 8192, minLength: 1 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["authorityCode", "placeId", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { key: { type: "string", maxLength: 8192 } },
      required: ["key"],
    },
    ports: {
      inputs: [
        {
          id: "authorityCode",
          label: "Authority Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "placeId",
          label: "Place Id",
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
      outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = historicalGazetteerAsOfKeyTool.execute;
export default historicalGazetteerAsOfKeyTool;
