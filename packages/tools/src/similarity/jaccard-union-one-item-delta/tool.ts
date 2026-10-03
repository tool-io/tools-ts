import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly intersection: number;
  readonly union: number;
  readonly common: boolean;
};
export type Output = {
  readonly before: number;
  readonly after: number;
  readonly delta: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intersection: { type: "integer", minimum: 0 },
    union: { type: "integer", minimum: 1 },
    common: { type: "boolean" },
  },
  required: ["intersection", "union", "common"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    before: { type: "number" },
    after: { type: "number" },
    delta: { type: "number" },
  },
  required: ["before", "after", "delta"],
} as const;
/** Compute jaccard union one item delta from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { intersection, union, common } = input;
  const compute = (): Output => {
    integer(union, 1);
    integer(intersection, 0, union);
    const before = intersection / union,
      after = (intersection + (common ? 1 : 0)) / (union + 1);
    return { before, after, delta: after - before };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { intersection: 1, union: 2, common: false },
  output: {
    before: 0.5,
    after: 0.3333333333333333,
    delta: -0.16666666666666669,
  },
} satisfies ToolExample<Input, Output>;
export const jaccardUnionOneItemDeltaTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "similarity/jaccard-union-one-item-delta",
  title: "Jaccard Union One Item Delta Tool",
  description:
    "Compute jaccard union one item delta from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "intersection",
        label: "Intersection",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "union",
        label: "Union",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "common",
        label: "Common",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "before", label: "Before", valueType: { type: "number" } },
      { id: "after", label: "After", valueType: { type: "number" } },
      { id: "delta", label: "Delta", valueType: { type: "number" } },
    ],
  },
});
export const run = jaccardUnionOneItemDeltaTool.execute;
export default jaccardUnionOneItemDeltaTool;
