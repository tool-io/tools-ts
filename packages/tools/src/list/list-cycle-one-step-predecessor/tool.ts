import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly length: number; readonly index: number };
export type Output = { readonly predecessor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 1 },
    index: { type: "integer", minimum: 0 },
  },
  required: ["length", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { predecessor: { type: "integer" } },
  required: ["predecessor"],
} as const;
/** Calculate list cycle one step predecessor from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { length, index } = input;
  const compute = (): Output => {
    H.integer(length, 1);
    H.integer(index, 0, length - 1);
    return { predecessor: H.mod(index - 1, length) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { length: 5, index: 0 },
  output: { predecessor: 4 },
} satisfies ToolExample<Input, Output>;
export const listCycleOneStepPredecessorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-cycle-one-step-predecessor",
    title: "List Cycle One Step Predecessor Tool",
    description:
      "Calculate list cycle one step predecessor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 1 },
        index: { type: "integer", minimum: 0 },
      },
      required: ["length", "index"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { predecessor: { type: "integer" } },
      required: ["predecessor"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "predecessor",
          label: "Predecessor",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = listCycleOneStepPredecessorTool.execute;
export default listCycleOneStepPredecessorTool;
