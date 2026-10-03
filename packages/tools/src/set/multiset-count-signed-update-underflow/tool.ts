import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly delta: number;
  readonly clamp: boolean;
};
export type Output = { readonly count: number; readonly underflow: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    delta: { type: "integer" },
    clamp: { type: "boolean" },
  },
  required: ["count", "delta", "clamp"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer" }, underflow: { type: "boolean" } },
  required: ["count", "underflow"],
} as const;
/** Calculate multiset count signed update underflow from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, delta, clamp } = request;
  const compute = (): Output => {
    H.integer(count, 0);
    const raw = count + delta;
    H.domain(clamp || raw >= 0);
    return { count: clamp ? Math.max(0, raw) : raw, underflow: raw < 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 3, delta: -5, clamp: true },
  output: { count: 0, underflow: true },
} satisfies ToolExample<Input, Output>;
export const multisetCountSignedUpdateUnderflowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/multiset-count-signed-update-underflow",
    title: "Multiset Count Signed Update Underflow Tool",
    description:
      "Calculate multiset count signed update underflow from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        delta: { type: "integer" },
        clamp: { type: "boolean" },
      },
      required: ["count", "delta", "clamp"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer" },
        underflow: { type: "boolean" },
      },
      required: ["count", "underflow"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "delta",
          label: "Delta",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "clamp",
          label: "Clamp",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "count", label: "Count", valueType: { type: "integer" } },
        { id: "underflow", label: "Underflow", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = multisetCountSignedUpdateUnderflowTool.execute;
export default multisetCountSignedUpdateUnderflowTool;
