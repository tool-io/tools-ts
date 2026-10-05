import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly dateText: string; readonly source: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dateText: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["dateText", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label literal source date wording as Rumi without guessing a Julian/Gregorian conversion or calendar-reform convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dateText, source } = request;
  const compute = (): Output => {
    H.domain(dateText.length > 0 && source.length > 0, "dateText");
    return { label: dateText + " [Rumi; " + source + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dateText: "1325-03-12", source: "Register A" },
  output: { label: "1325-03-12 [Rumi; Register A]" },
} satisfies ToolExample<Input, Output>;
export const ottomanRumiDateSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "middle-eastern-studies/ottoman-rumi-date-source-label",
    title: "Ottoman Rumi Date Source Label Tool",
    description:
      "Label literal source date wording as Rumi without guessing a Julian/Gregorian conversion or calendar-reform convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dateText: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["dateText", "source"],
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
export const run = ottomanRumiDateSourceLabelTool.execute;
export default ottomanRumiDateSourceLabelTool;
