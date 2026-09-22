import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedYear: number;
  readonly suppliedOffset: number;
  readonly offsetKnown: boolean;
};
export type Output = {
  readonly convertedKnown: boolean;
  readonly convertedYear: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedYear: { type: "integer" },
    suppliedOffset: { type: "integer" },
    offsetKnown: { type: "boolean" },
  },
  required: ["recordedYear", "suppliedOffset", "offsetKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedKnown: { type: "boolean" },
    convertedYear: { type: "integer" },
  },
  required: ["convertedKnown", "convertedYear"],
} as const;
/** Year-offset bookkeeping only for a caller-asserted compatible era mapping. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedYear, suppliedOffset, offsetKnown } = request;
  const compute = (): Output => {
    return {
      convertedKnown: offsetKnown,
      convertedYear: offsetKnown ? recordedYear + suppliedOffset : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedYear: 1400, suppliedOffset: 600, offsetKnown: true },
  output: { convertedKnown: true, convertedYear: 2000 },
} satisfies ToolExample<Input, Output>;
export const regionalDualeraYearTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "area-studies/regional-dualera-year-token",
    title: "Regional Dualera Year Token Tool",
    description:
      "Year-offset bookkeeping only for a caller-asserted compatible era mapping.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedYear: { type: "integer" },
        suppliedOffset: { type: "integer" },
        offsetKnown: { type: "boolean" },
      },
      required: ["recordedYear", "suppliedOffset", "offsetKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedKnown: { type: "boolean" },
        convertedYear: { type: "integer" },
      },
      required: ["convertedKnown", "convertedYear"],
    },
    ports: {
      inputs: [
        {
          id: "recordedYear",
          label: "Recorded Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedOffset",
          label: "Supplied Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "offsetKnown",
          label: "Offset Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "convertedKnown",
          label: "Converted Known",
          valueType: { type: "boolean" },
        },
        {
          id: "convertedYear",
          label: "Converted Year",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = regionalDualeraYearTokenTool.execute;
export default regionalDualeraYearTokenTool;
