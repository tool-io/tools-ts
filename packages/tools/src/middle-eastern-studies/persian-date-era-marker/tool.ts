import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dateToken: string;
  readonly eraMarker: string;
  readonly expectedMarker: string;
};
export type Output = { readonly matches: boolean; readonly preserved: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dateToken: { type: "string", maxLength: 8192 },
    eraMarker: { type: "string", maxLength: 8192 },
    expectedMarker: { type: "string", maxLength: 8192 },
  },
  required: ["dateToken", "eraMarker", "expectedMarker"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matches: { type: "boolean" },
    preserved: { type: "string", maxLength: 8192 },
  },
  required: ["matches", "preserved"],
} as const;
/** Retain and compare supplied era markers without converting Persian calendar dates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dateToken, eraMarker, expectedMarker } = request;
  const compute = (): Output => {
    H.domain(eraMarker.length > 0 && expectedMarker.length > 0);
    return {
      matches: eraMarker === expectedMarker,
      preserved: JSON.stringify([dateToken, eraMarker]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dateToken: "1403", eraMarker: "SH", expectedMarker: "SH" },
  output: { matches: true, preserved: '["1403","SH"]' },
} satisfies ToolExample<Input, Output>;
export const persianDateEraMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "middle-eastern-studies/persian-date-era-marker",
    title: "Persian Date Era Marker Tool",
    description:
      "Retain and compare supplied era markers without converting Persian calendar dates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dateToken: { type: "string", maxLength: 8192 },
        eraMarker: { type: "string", maxLength: 8192 },
        expectedMarker: { type: "string", maxLength: 8192 },
      },
      required: ["dateToken", "eraMarker", "expectedMarker"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matches: { type: "boolean" },
        preserved: { type: "string", maxLength: 8192 },
      },
      required: ["matches", "preserved"],
    },
    ports: {
      inputs: [
        {
          id: "dateToken",
          label: "Date Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "eraMarker",
          label: "Era Marker",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedMarker",
          label: "Expected Marker",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
        { id: "preserved", label: "Preserved", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = persianDateEraMarkerTool.execute;
export default persianDateEraMarkerTool;
