import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly lower: number; readonly upper: number };
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lower: { type: "number" }, upper: { type: "number" } },
  required: ["lower", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate en dash numeric range sign guard from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lower, upper } = request;
  const compute = (): Output => {
    H.domain(lower <= upper);
    const wrap = (n: number) => (n < 0 ? "(" + n + ")" : String(n));
    return { text: wrap(lower) + "–" + wrap(upper) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lower: -5, upper: -2 },
  output: { text: "(-5)–(-2)" },
} satisfies ToolExample<Input, Output>;
export const enDashNumericRangeSignGuardTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/en-dash-numeric-range-sign-guard",
    title: "En Dash Numeric Range Sign Guard Tool",
    description:
      "Calculate en dash numeric range sign guard from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lower: { type: "number" }, upper: { type: "number" } },
      required: ["lower", "upper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = enDashNumericRangeSignGuardTool.execute;
export default enDashNumericRangeSignGuardTool;
