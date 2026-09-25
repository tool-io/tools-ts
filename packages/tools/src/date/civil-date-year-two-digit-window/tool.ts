import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly year: number; readonly windowStart: number };
export type Output = {
  readonly twoDigit: string;
  readonly representable: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer", minimum: 1, maximum: 9999 },
    windowStart: { type: "integer", minimum: 1, maximum: 9900 },
  },
  required: ["year", "windowStart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    twoDigit: { type: "string", maxLength: 8192 },
    representable: { type: "boolean" },
  },
  required: ["twoDigit", "representable"],
} as const;
/** Compute civil date year two digit window from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { year, windowStart } = input;
  const compute = (): Output => {
    integer(year, 1, 9999);
    integer(windowStart, 1, 9900);
    return {
      twoDigit: String(year % 100).padStart(2, "0"),
      representable: year >= windowStart && year < windowStart + 100,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { year: 2024, windowStart: 1970 },
  output: { twoDigit: "24", representable: true },
} satisfies ToolExample<Input, Output>;
export const civilDateYearTwoDigitWindowTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/civil-date-year-two-digit-window",
  title: "Civil Date Year Two Digit Window Tool",
  description:
    "Compute civil date year two digit window from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "year",
        label: "Year",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "windowStart",
        label: "Window Start",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "twoDigit", label: "Two Digit", valueType: { type: "string" } },
      {
        id: "representable",
        label: "Representable",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = civilDateYearTwoDigitWindowTool.execute;
export default civilDateYearTwoDigitWindowTool;
