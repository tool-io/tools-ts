import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly string[];
  readonly second: readonly string[];
};
export type Output = { readonly witnessSize: number; readonly empty: boolean };
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
  properties: { witnessSize: { type: "integer" }, empty: { type: "boolean" } },
  required: ["witnessSize", "empty"],
} as const;
/** Calculate intersection emptiness witness size from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    const witnessSize = new Set(first.filter((x) => second.includes(x))).size;
    return { witnessSize, empty: witnessSize === 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: ["a", "b", "b"], second: ["b", "c"] },
  output: { witnessSize: 1, empty: false },
} satisfies ToolExample<Input, Output>;
export const intersectionEmptinessWitnessSizeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/intersection-emptiness-witness-size",
    title: "Intersection Emptiness Witness Size Tool",
    description:
      "Calculate intersection emptiness witness size from explicit caller-supplied inputs.",
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
        witnessSize: { type: "integer" },
        empty: { type: "boolean" },
      },
      required: ["witnessSize", "empty"],
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
        {
          id: "witnessSize",
          label: "Witness Size",
          valueType: { type: "integer" },
        },
        { id: "empty", label: "Empty", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = intersectionEmptinessWitnessSizeTool.execute;
export default intersectionEmptinessWitnessSizeTool;
