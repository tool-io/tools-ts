import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dateText: string;
  readonly calendarName: string;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dateText: { type: "string", maxLength: 8192 },
    calendarName: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["dateText", "calendarName", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Preserve literal document-date wording alongside its explicitly supplied calendar and source, without converting calendars. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dateText, calendarName, source } = request;
  const compute = (): Output => {
    H.domain(
      dateText.length > 0 && calendarName.length > 0 && source.length > 0,
      "dateText",
    );
    return { label: dateText + " [" + calendarName + "; " + source + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dateText: "12/3/1340",
    calendarName: "source calendar",
    source: "Document A",
  },
  output: { label: "12/3/1340 [source calendar; Document A]" },
} satisfies ToolExample<Input, Output>;
export const africanDocumentCalendarSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "african-studies/african-document-calendar-source-label",
    title: "African Document Calendar Source Label Tool",
    description:
      "Preserve literal document-date wording alongside its explicitly supplied calendar and source, without converting calendars.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dateText: { type: "string", maxLength: 8192 },
        calendarName: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["dateText", "calendarName", "source"],
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
          id: "dateText",
          label: "Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "calendarName",
          label: "Calendar Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = africanDocumentCalendarSourceLabelTool.execute;
export default africanDocumentCalendarSourceLabelTool;
