import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLength: number;
  readonly secondLength: number;
  readonly selected: number;
};
export type Output = { readonly source: number; readonly localIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLength: { type: "integer", minimum: 0 },
    secondLength: { type: "integer", minimum: 0 },
    selected: { type: "integer", minimum: 0 },
  },
  required: ["firstLength", "secondLength", "selected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { source: { type: "integer" }, localIndex: { type: "integer" } },
  required: ["source", "localIndex"],
} as const;
/** Calculate list two slice concatenation index from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { firstLength, secondLength, selected } = input;
  const compute = (): Output => {
    H.integer(firstLength, 0);
    H.integer(secondLength, 0);
    H.integer(selected, 0, firstLength + secondLength - 1);
    return {
      source: selected < firstLength ? 0 : 1,
      localIndex: selected < firstLength ? selected : selected - firstLength,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { firstLength: 3, secondLength: 4, selected: 5 },
  output: { source: 1, localIndex: 2 },
} satisfies ToolExample<Input, Output>;
export const listTwoSliceConcatenationIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-two-slice-concatenation-index",
    title: "List Two Slice Concatenation Index Tool",
    description:
      "Calculate list two slice concatenation index from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLength: { type: "integer", minimum: 0 },
        secondLength: { type: "integer", minimum: 0 },
        selected: { type: "integer", minimum: 0 },
      },
      required: ["firstLength", "secondLength", "selected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        source: { type: "integer" },
        localIndex: { type: "integer" },
      },
      required: ["source", "localIndex"],
    },
    ports: {
      inputs: [
        {
          id: "firstLength",
          label: "First Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondLength",
          label: "Second Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "selected",
          label: "Selected",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "source", label: "Source", valueType: { type: "integer" } },
        {
          id: "localIndex",
          label: "Local Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = listTwoSliceConcatenationIndexTool.execute;
export default listTwoSliceConcatenationIndexTool;
