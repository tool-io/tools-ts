import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceDate: string;
  readonly discloseDate: boolean;
  readonly suppliedMask: string;
};
export type Output = { readonly displayDate: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceDate: { type: "string", maxLength: 8192 },
    discloseDate: { type: "boolean" },
    suppliedMask: { type: "string", maxLength: 8192 },
  },
  required: ["referenceDate", "discloseDate", "suppliedMask"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displayDate: { type: "string", maxLength: 8192 } },
  required: ["displayDate"],
} as const;
/** Choose supplied household-roster reference date or a caller-supplied mask under an explicit disclosure flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceDate, discloseDate, suppliedMask } = request;
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
    namedDate(referenceDate, "referenceDate");
    return { displayDate: discloseDate ? referenceDate : suppliedMask };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceDate: "2026-11-01",
    discloseDate: false,
    suppliedMask: "withheld",
  },
  output: { displayDate: "withheld" },
} satisfies ToolExample<Input, Output>;
export const householdRosterReferenceDateMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-anthropology/household-roster-reference-date-mask",
    title: "Household Roster Reference Date Mask Tool",
    description:
      "Choose supplied household-roster reference date or a caller-supplied mask under an explicit disclosure flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceDate: { type: "string", maxLength: 8192 },
        discloseDate: { type: "boolean" },
        suppliedMask: { type: "string", maxLength: 8192 },
      },
      required: ["referenceDate", "discloseDate", "suppliedMask"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { displayDate: { type: "string", maxLength: 8192 } },
      required: ["displayDate"],
    },
    ports: {
      inputs: [
        {
          id: "referenceDate",
          label: "Reference Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "discloseDate",
          label: "Disclose Date",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedMask",
          label: "Supplied Mask",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "displayDate",
          label: "Display Date",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = householdRosterReferenceDateMaskTool.execute;
export default householdRosterReferenceDateMaskTool;
