import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dateRecordId: string;
  readonly conventionText: string;
  readonly sourceId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dateRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    conventionText: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["dateRecordId", "conventionText", "sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly supplied Islamic calendar convention and source without inferring intercalation or converting dates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dateRecordId, conventionText, sourceId } = request;
  const compute = (): Output => {
    H.domain(dateRecordId.length > 0, "dateRecordId");
    H.domain(conventionText.length > 0, "conventionText");
    H.domain(sourceId.length > 0, "sourceId");
    return { token: JSON.stringify([dateRecordId, conventionText, sourceId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dateRecordId: "D17",
    conventionText: "tabular leap-day convention",
    sourceId: "S4",
  },
  output: { token: '["D17","tabular leap-day convention","S4"]' },
} satisfies ToolExample<Input, Output>;
export const islamicCalendarIntercalaryConventionLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "islamic-studies/islamic-calendar-intercalary-convention-label",
      title: "Islamic Calendar Intercalary Convention Label Tool",
      description:
        "Preserve an explicitly supplied Islamic calendar convention and source without inferring intercalation or converting dates.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dateRecordId: { type: "string", maxLength: 8192, minLength: 1 },
          conventionText: { type: "string", maxLength: 8192, minLength: 1 },
          sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["dateRecordId", "conventionText", "sourceId"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "dateRecordId",
            label: "Date Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "conventionText",
            label: "Convention Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceId",
            label: "Source Id",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = islamicCalendarIntercalaryConventionLabelTool.execute;
export default islamicCalendarIntercalaryConventionLabelTool;
