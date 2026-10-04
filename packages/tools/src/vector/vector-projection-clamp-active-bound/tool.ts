import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parameter: number;
  readonly lower: number;
  readonly upper: number;
};
export type Output = { readonly clamped: number; readonly active: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parameter: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["parameter", "lower", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clamped: { type: "number" },
    active: { type: "string", maxLength: 8192 },
  },
  required: ["clamped", "active"],
} as const;
/** Calculate vector projection clamp active bound from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { parameter, lower, upper } = input;
  const compute = (): Output => {
    H.domain(lower < upper);
    return {
      clamped: Math.max(lower, Math.min(upper, parameter)),
      active:
        parameter <= lower
          ? "lower"
          : parameter >= upper
            ? "upper"
            : "interior",
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { parameter: 2, lower: 0, upper: 1 },
  output: { clamped: 1, active: "upper" },
} satisfies ToolExample<Input, Output>;
export const vectorProjectionClampActiveBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-projection-clamp-active-bound",
    title: "Vector Projection Clamp Active Bound Tool",
    description:
      "Calculate vector projection clamp active bound from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parameter: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
      },
      required: ["parameter", "lower", "upper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clamped: { type: "number" },
        active: { type: "string", maxLength: 8192 },
      },
      required: ["clamped", "active"],
    },
    ports: {
      inputs: [
        {
          id: "parameter",
          label: "Parameter",
          required: true,
          valueType: { type: "number" },
        },
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
      outputs: [
        { id: "clamped", label: "Clamped", valueType: { type: "number" } },
        { id: "active", label: "Active", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = vectorProjectionClampActiveBoundTool.execute;
export default vectorProjectionClampActiveBoundTool;
