import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly knots: readonly number[];
  readonly index: number;
};
export type Output = { readonly span: number; readonly zero: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    knots: { type: "array", maxItems: 256, items: { type: "number" } },
    index: { type: "integer", minimum: 0 },
  },
  required: ["knots", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { span: { type: "number" }, zero: { type: "boolean" } },
  required: ["span", "zero"],
} as const;
/** Compute spline knot interval zero span flag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { knots, index } = input;
  const compute = (): Output => {
    domain(knots.every((x, i) => i === 0 || x >= knots[i - 1]));
    integer(index, 0, knots.length - 2);
    const span = knots[index + 1] - knots[index];
    return { span, zero: span === 0 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { knots: [0, 0, 1], index: 0 },
  output: { span: 0, zero: true },
} satisfies ToolExample<Input, Output>;
export const splineKnotIntervalZeroSpanFlagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "interpolation/spline-knot-interval-zero-span-flag",
  title: "Spline Knot Interval Zero Span Flag Tool",
  description:
    "Compute spline knot interval zero span flag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "knots",
        label: "Knots",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "index",
        label: "Index",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "span", label: "Span", valueType: { type: "number" } },
      { id: "zero", label: "Zero", valueType: { type: "boolean" } },
    ],
  },
});
export const run = splineKnotIntervalZeroSpanFlagTool.execute;
export default splineKnotIntervalZeroSpanFlagTool;
