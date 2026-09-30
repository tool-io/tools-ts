import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly values: readonly string[];
  readonly sentinel: string;
};
export type Output = {
  readonly collision: boolean;
  readonly indexes: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sentinel: { type: "string", maxLength: 8192 },
  },
  required: ["values", "sentinel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collision: { type: "boolean" },
    indexes: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["collision", "indexes"],
} as const;
/** Calculate list sentinel data value collision from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { values, sentinel } = input;
  const compute = (): Output => {
    const indexes = values.flatMap((x, i) => (x === sentinel ? [i] : []));
    return { collision: indexes.length > 0, indexes };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { values: ["a", "_", "b", "_"], sentinel: "_" },
  output: { collision: true, indexes: [1, 3] },
} satisfies ToolExample<Input, Output>;
export const listSentinelDataValueCollisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-sentinel-data-value-collision",
    title: "List Sentinel Data Value Collision Tool",
    description:
      "Calculate list sentinel data value collision from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sentinel: { type: "string", maxLength: 8192 },
      },
      required: ["values", "sentinel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collision: { type: "boolean" },
        indexes: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["collision", "indexes"],
    },
    ports: {
      inputs: [
        {
          id: "values",
          label: "Values",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sentinel",
          label: "Sentinel",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "collision", label: "Collision", valueType: { type: "boolean" } },
        {
          id: "indexes",
          label: "Indexes",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = listSentinelDataValueCollisionTool.execute;
export default listSentinelDataValueCollisionTool;
