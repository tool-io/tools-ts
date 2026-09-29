import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly era: string;
  readonly source: string;
  readonly regnalYear: number;
  readonly suppliedFirstYear: number;
};
export type Output = {
  readonly nominalYear: number;
  readonly sourceKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    era: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    regnalYear: { type: "integer", minimum: 1 },
    suppliedFirstYear: { type: "integer" },
  },
  required: ["era", "source", "regnalYear", "suppliedFirstYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalYear: { type: "integer" },
    sourceKey: { type: "string", maxLength: 8192 },
  },
  required: ["nominalYear", "sourceKey"],
} as const;
/** Apply an explicitly supplied first-year anchor and one-based regnal index; no accession/calendar convention is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { era, source, regnalYear, suppliedFirstYear } = request;
  const compute = (): Output => {
    H.integer(regnalYear, 1);
    return {
      nominalYear: suppliedFirstYear + regnalYear - 1,
      sourceKey: JSON.stringify([source, era, regnalYear]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    era: "era-A",
    source: "register-2",
    regnalYear: 5,
    suppliedFirstYear: 1700,
  },
  output: { nominalYear: 1704, sourceKey: '["register-2","era-A",5]' },
} satisfies ToolExample<Input, Output>;
export const regnalYearEraTokenTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "history/regnal-year-era-token",
    title: "Regnal Year Era Token Tool",
    description:
      "Apply an explicitly supplied first-year anchor and one-based regnal index; no accession/calendar convention is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        era: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        regnalYear: { type: "integer", minimum: 1 },
        suppliedFirstYear: { type: "integer" },
      },
      required: ["era", "source", "regnalYear", "suppliedFirstYear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalYear: { type: "integer" },
        sourceKey: { type: "string", maxLength: 8192 },
      },
      required: ["nominalYear", "sourceKey"],
    },
    ports: {
      inputs: [
        {
          id: "era",
          label: "Era",
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
          id: "regnalYear",
          label: "Regnal Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedFirstYear",
          label: "Supplied First Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nominalYear",
          label: "Nominal Year",
          valueType: { type: "integer" },
        },
        { id: "sourceKey", label: "Source Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = regnalYearEraTokenTool.execute;
export default regnalYearEraTokenTool;
