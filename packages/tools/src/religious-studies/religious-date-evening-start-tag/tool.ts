import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dateText: string;
  readonly eveningStartRecorded: boolean;
  readonly calendarSource: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dateText: { type: "string", maxLength: 8192, minLength: 1 },
    eveningStartRecorded: { type: "boolean" },
    calendarSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["dateText", "eveningStartRecorded", "calendarSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly reported evening-start convention without converting religious calendars or predicting sunset. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dateText, eveningStartRecorded, calendarSource } = request;
  const compute = (): Output => {
    H.domain(dateText.length > 0 && calendarSource.length > 0, "dateText");
    return {
      label:
        dateText +
        (eveningStartRecorded ? " [evening start]" : " [start unspecified]") +
        "; " +
        calendarSource,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dateText: "Date A",
    eveningStartRecorded: true,
    calendarSource: "Calendar A",
  },
  output: { label: "Date A [evening start]; Calendar A" },
} satisfies ToolExample<Input, Output>;
export const religiousDateEveningStartTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["religious-studies", "religious studies", "humanities"],
      keywords: ["religious studies", "humanities"],
    },
    id: "religious-studies/religious-date-evening-start-tag",
    title: "Religious Date Evening Start Tag",
    description:
      "Label an explicitly reported evening-start convention without converting religious calendars or predicting sunset.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dateText: { type: "string", maxLength: 8192, minLength: 1 },
        eveningStartRecorded: { type: "boolean" },
        calendarSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["dateText", "eveningStartRecorded", "calendarSource"],
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
          id: "eveningStartRecorded",
          label: "Evening Start Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "calendarSource",
          label: "Calendar Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = religiousDateEveningStartTagTool.execute;
export default religiousDateEveningStartTagTool;
