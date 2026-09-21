import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDate: string;
  readonly secondDate: string;
  readonly firstCalendar: string;
  readonly secondCalendar: string;
};
export type Output = { readonly sameCalendar: boolean; readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDate: { type: "string", maxLength: 8192 },
    secondDate: { type: "string", maxLength: 8192 },
    firstCalendar: { type: "string", maxLength: 8192 },
    secondCalendar: { type: "string", maxLength: 8192 },
  },
  required: ["firstDate", "secondDate", "firstCalendar", "secondCalendar"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameCalendar: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["sameCalendar", "key"],
} as const;
/** Preserve dual-date source labels without inventing a calendar conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDate, secondDate, firstCalendar, secondCalendar } = request;
  const compute = (): Output => {
    H.domain(firstCalendar.length > 0 && secondCalendar.length > 0);
    return {
      sameCalendar: firstCalendar === secondCalendar,
      key: JSON.stringify([
        firstCalendar,
        firstDate,
        secondCalendar,
        secondDate,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstDate: "1900",
    secondDate: "1317",
    firstCalendar: "Gregorian",
    secondCalendar: "Hijri",
  },
  output: { sameCalendar: false, key: '["Gregorian","1900","Hijri","1317"]' },
} satisfies ToolExample<Input, Output>;
export const africanArchiveDualDateTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "african-studies/african-archive-dual-date-token",
    title: "African Archive Dual Date Token Tool",
    description:
      "Preserve dual-date source labels without inventing a calendar conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDate: { type: "string", maxLength: 8192 },
        secondDate: { type: "string", maxLength: 8192 },
        firstCalendar: { type: "string", maxLength: 8192 },
        secondCalendar: { type: "string", maxLength: 8192 },
      },
      required: ["firstDate", "secondDate", "firstCalendar", "secondCalendar"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameCalendar: { type: "boolean" },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["sameCalendar", "key"],
    },
    ports: {
      inputs: [
        {
          id: "firstDate",
          label: "First Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondDate",
          label: "Second Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstCalendar",
          label: "First Calendar",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondCalendar",
          label: "Second Calendar",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "sameCalendar",
          label: "Same Calendar",
          valueType: { type: "boolean" },
        },
        { id: "key", label: "Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = africanArchiveDualDateTokenTool.execute;
export default africanArchiveDualDateTokenTool;
