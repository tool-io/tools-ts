import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly left: readonly string[];
  readonly right: readonly string[];
  readonly multiset: boolean;
};
export type Output = { readonly intersection: number; readonly union: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    right: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    multiset: { type: "boolean" },
  },
  required: ["left", "right", "multiset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { intersection: { type: "integer" }, union: { type: "integer" } },
  required: ["intersection", "union"],
} as const;
/** Compute token overlap multiplicity policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right, multiset } = input;
  const compute = (): Output => {
    const a = new Map<string, number>(),
      b = new Map<string, number>();
    for (const x of left) a.set(x, multiset ? (a.get(x) ?? 0) + 1 : 1);
    for (const x of right) b.set(x, multiset ? (b.get(x) ?? 0) + 1 : 1);
    let intersection = 0,
      union = 0;
    for (const k of new Set([...a.keys(), ...b.keys()])) {
      intersection += Math.min(a.get(k) ?? 0, b.get(k) ?? 0);
      union += Math.max(a.get(k) ?? 0, b.get(k) ?? 0);
    }
    return { intersection, union };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: ["a", "a"], right: ["a"], multiset: true },
  output: { intersection: 1, union: 2 },
} satisfies ToolExample<Input, Output>;
export const tokenOverlapMultiplicityPolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "similarity/token-overlap-multiplicity-policy",
  title: "Token Overlap Multiplicity Policy Tool",
  description:
    "Compute token overlap multiplicity policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
      {
        id: "multiset",
        label: "Multiset",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      {
        id: "intersection",
        label: "Intersection",
        valueType: { type: "integer" },
      },
      { id: "union", label: "Union", valueType: { type: "integer" } },
    ],
  },
});
export const run = tokenOverlapMultiplicityPolicyTool.execute;
export default tokenOverlapMultiplicityPolicyTool;
