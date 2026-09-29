import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signatureDate: string;
  readonly ratificationDate: string;
  readonly entryDate: string;
};
export type Output = {
  readonly signatureToRatificationDays: number;
  readonly ratificationToEntryDays: number;
  readonly chronological: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signatureDate: { type: "string", maxLength: 8192 },
    ratificationDate: { type: "string", maxLength: 8192 },
    entryDate: { type: "string", maxLength: 8192 },
  },
  required: ["signatureDate", "ratificationDate", "entryDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signatureToRatificationDays: { type: "integer" },
    ratificationToEntryDays: { type: "integer" },
    chronological: { type: "boolean" },
  },
  required: [
    "signatureToRatificationDays",
    "ratificationToEntryDays",
    "chronological",
  ],
} as const;
/** Inspect supplied public chronology only; no legal effectiveness determination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signatureDate, ratificationDate, entryDate } = request;
  const compute = (): Output => {
    return (() => {
      const a = H.dateOnly(signatureDate).getTime(),
        b = H.dateOnly(ratificationDate).getTime(),
        c = H.dateOnly(entryDate).getTime();
      return {
        signatureToRatificationDays: (b - a) / 86400000,
        ratificationToEntryDays: (c - b) / 86400000,
        chronological: a <= b && b <= c,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    signatureDate: "2024-01-01",
    ratificationDate: "2024-01-03",
    entryDate: "2024-01-08",
  },
  output: {
    signatureToRatificationDays: 2,
    ratificationToEntryDays: 5,
    chronological: true,
  },
} satisfies ToolExample<Input, Output>;
export const treatyPartyDateOrderFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/treaty-party-date-order-flag",
    title: "Treaty Party Date Order Flag Tool",
    description:
      "Inspect supplied public chronology only; no legal effectiveness determination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signatureDate: { type: "string", maxLength: 8192 },
        ratificationDate: { type: "string", maxLength: 8192 },
        entryDate: { type: "string", maxLength: 8192 },
      },
      required: ["signatureDate", "ratificationDate", "entryDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signatureToRatificationDays: { type: "integer" },
        ratificationToEntryDays: { type: "integer" },
        chronological: { type: "boolean" },
      },
      required: [
        "signatureToRatificationDays",
        "ratificationToEntryDays",
        "chronological",
      ],
    },
    ports: {
      inputs: [
        {
          id: "signatureDate",
          label: "Signature Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ratificationDate",
          label: "Ratification Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "entryDate",
          label: "Entry Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signatureToRatificationDays",
          label: "Signature To Ratification Days",
          valueType: { type: "integer" },
        },
        {
          id: "ratificationToEntryDays",
          label: "Ratification To Entry Days",
          valueType: { type: "integer" },
        },
        {
          id: "chronological",
          label: "Chronological",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = treatyPartyDateOrderFlagTool.execute;
export default treatyPartyDateOrderFlagTool;
