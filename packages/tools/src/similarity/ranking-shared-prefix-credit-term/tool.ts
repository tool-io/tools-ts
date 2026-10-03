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
  readonly left: readonly string[];
  readonly right: readonly string[];
  readonly depth: number;
};
export type Output = { readonly shared: number; readonly credit: number };
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
    depth: { type: "integer", minimum: 1, maximum: 256 },
  },
  required: ["left", "right", "depth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shared: { type: "integer" }, credit: { type: "number" } },
  required: ["shared", "credit"],
} as const;
/** Compute ranking shared prefix credit term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right, depth } = input;
  const compute = (): Output => {
    integer(depth, 1, 256);
    domain(depth <= left.length && depth <= right.length);
    const a = new Set(left.slice(0, depth)),
      b = new Set(right.slice(0, depth));
    domain(a.size === depth && b.size === depth);
    const shared = [...a].filter((x) => b.has(x)).length;
    return { shared, credit: shared / depth };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: ["a", "b"], right: ["b", "c"], depth: 2 },
  output: { shared: 1, credit: 0.5 },
} satisfies ToolExample<Input, Output>;
export const rankingSharedPrefixCreditTermTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "similarity/ranking-shared-prefix-credit-term",
  title: "Ranking Shared Prefix Credit Term Tool",
  description:
    "Compute ranking shared prefix credit term from explicit bounded inputs.",
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
        id: "depth",
        label: "Depth",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "shared", label: "Shared", valueType: { type: "integer" } },
      { id: "credit", label: "Credit", valueType: { type: "number" } },
    ],
  },
});
export const run = rankingSharedPrefixCreditTermTool.execute;
export default rankingSharedPrefixCreditTermTool;
