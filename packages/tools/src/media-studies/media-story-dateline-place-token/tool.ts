import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly placeName: string; readonly date: string };
export type Output = { readonly dateline: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    placeName: { type: "string", maxLength: 8192 },
    date: { type: "string", maxLength: 8192 },
  },
  required: ["placeName", "date"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dateline: { type: "string", maxLength: 8192 } },
  required: ["dateline"],
} as const;
/** Format an explicitly supplied story dateline place and Gregorian date without geocoding or inferring reporting location. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { placeName, date } = request;
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
    H.domain(placeName.length > 0, "placeName");
    namedDate(date, "date");
    return { dateline: placeName + ", " + date };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { placeName: "Berlin", date: "2026-11-01" },
  output: { dateline: "Berlin, 2026-11-01" },
} satisfies ToolExample<Input, Output>;
export const mediaStoryDatelinePlaceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/media-story-dateline-place-token",
    title: "Media Story Dateline Place Token Tool",
    description:
      "Format an explicitly supplied story dateline place and Gregorian date without geocoding or inferring reporting location.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        placeName: { type: "string", maxLength: 8192 },
        date: { type: "string", maxLength: 8192 },
      },
      required: ["placeName", "date"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dateline: { type: "string", maxLength: 8192 } },
      required: ["dateline"],
    },
    ports: {
      inputs: [
        {
          id: "placeName",
          label: "Place Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "date",
          label: "Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "dateline", label: "Dateline", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = mediaStoryDatelinePlaceTokenTool.execute;
export default mediaStoryDatelinePlaceTokenTool;
