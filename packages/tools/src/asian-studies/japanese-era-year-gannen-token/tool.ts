import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly eraName: string; readonly eraYear: number };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eraName: { type: "string", maxLength: 8192 },
    eraYear: { type: "integer", minimum: 1 },
  },
  required: ["eraName", "eraYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format a caller-supplied Japanese era name and positive era-year number, using 元年 for the first year; no era/date conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eraName, eraYear } = request;
  const compute = (): Output => {
    H.domain(eraName.length > 0, "eraName");
    (H.domain(
      Number.isSafeInteger(eraYear) &&
        eraYear >= 1 &&
        eraYear <= Number.MAX_SAFE_INTEGER,
      "eraYear",
    ),
      eraYear);
    return { label: eraName + (eraYear === 1 ? "元年" : eraYear + "年") };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eraName: "令和", eraYear: 1 },
  output: { label: "令和元年" },
} satisfies ToolExample<Input, Output>;
export const japaneseEraYearGannenTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/japanese-era-year-gannen-token",
    title: "Japanese Era Year Gannen Token Tool",
    description:
      "Format a caller-supplied Japanese era name and positive era-year number, using 元年 for the first year; no era/date conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eraName: { type: "string", maxLength: 8192 },
        eraYear: { type: "integer", minimum: 1 },
      },
      required: ["eraName", "eraYear"],
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
          id: "eraName",
          label: "Era Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "eraYear",
          label: "Era Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = japaneseEraYearGannenTokenTool.execute;
export default japaneseEraYearGannenTokenTool;
