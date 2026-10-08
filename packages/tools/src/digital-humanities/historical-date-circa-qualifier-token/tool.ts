import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly dateText: string; readonly circa: boolean };
export type Output = { readonly qualifiedDate: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dateText: { type: "string", maxLength: 8192, minLength: 1 },
    circa: { type: "boolean" },
  },
  required: ["dateText", "circa"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { qualifiedDate: { type: "string", maxLength: 8192 } },
  required: ["qualifiedDate"],
} as const;
/** Apply an explicit English circa prefix to supplied historical date text without converting calendars or estimating uncertainty. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dateText, circa } = request;
  const compute = (): Output => {
    H.domain(dateText.length > 0, "dateText");
    return { qualifiedDate: (circa ? "c. " : "") + dateText };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dateText: "1900", circa: true },
  output: { qualifiedDate: "c. 1900" },
} satisfies ToolExample<Input, Output>;
export const historicalDateCircaQualifierTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/historical-date-circa-qualifier-token",
    title: "Historical Date Circa Qualifier Token Tool",
    description:
      "Apply an explicit English circa prefix to supplied historical date text without converting calendars or estimating uncertainty.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dateText: { type: "string", maxLength: 8192, minLength: 1 },
        circa: { type: "boolean" },
      },
      required: ["dateText", "circa"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { qualifiedDate: { type: "string", maxLength: 8192 } },
      required: ["qualifiedDate"],
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
          id: "circa",
          label: "Circa",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "qualifiedDate",
          label: "Qualified Date",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicalDateCircaQualifierTokenTool.execute;
export default historicalDateCircaQualifierTokenTool;
