import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly string[];
  readonly second: readonly string[];
};
export type Output = {
  readonly disjoint: boolean;
  readonly witnesses: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    second: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    disjoint: { type: "boolean" },
    witnesses: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["disjoint", "witnesses"],
} as const;
/** Calculate set partition block disjointness pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    const b = new Set(second),
      witnesses = [...new Set(first)].filter((x) => b.has(x));
    return { disjoint: witnesses.length === 0, witnesses };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: ["a", "b"], second: ["b", "c"] },
  output: { disjoint: false, witnesses: ["b"] },
} satisfies ToolExample<Input, Output>;
export const setPartitionBlockDisjointnessPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/set-partition-block-disjointness-pair",
    title: "Set Partition Block Disjointness Pair Tool",
    description:
      "Calculate set partition block disjointness pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        second: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        disjoint: { type: "boolean" },
        witnesses: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["disjoint", "witnesses"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "disjoint", label: "Disjoint", valueType: { type: "boolean" } },
        {
          id: "witnesses",
          label: "Witnesses",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = setPartitionBlockDisjointnessPairTool.execute;
export default setPartitionBlockDisjointnessPairTool;
