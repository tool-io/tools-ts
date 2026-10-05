import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dateText: string;
  readonly approximate: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dateText: { type: "string", maxLength: 8192 },
    approximate: { type: "boolean" },
  },
  required: ["dateText", "approximate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Apply a circa marker to a literal historical date according to an explicit approximation flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dateText, approximate } = request;
  const compute = (): Output => {
    H.domain(dateText.length > 0, "dateText");
    return { label: approximate ? "c. " + dateText : dateText };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dateText: "1450", approximate: true },
  output: { label: "c. 1450" },
} satisfies ToolExample<Input, Output>;
export const historicalDateCircaMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/historical-date-circa-marker",
    title: "Historical Date Circa Marker Tool",
    description:
      "Apply a circa marker to a literal historical date according to an explicit approximation flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dateText: { type: "string", maxLength: 8192 },
        approximate: { type: "boolean" },
      },
      required: ["dateText", "approximate"],
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
          id: "approximate",
          label: "Approximate",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = historicalDateCircaMarkerTool.execute;
export default historicalDateCircaMarkerTool;
