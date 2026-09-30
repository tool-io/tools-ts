import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly shift: number;
  readonly selected: number;
};
export type Output = { readonly source: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 1 },
    shift: { type: "integer" },
    selected: { type: "integer", minimum: 0 },
  },
  required: ["length", "shift", "selected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { source: { type: "integer" } },
  required: ["source"],
} as const;
/** Calculate list rotation selected index preimage from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { length, shift, selected } = input;
  const compute = (): Output => {
    H.integer(length, 1);
    H.integer(selected, 0, length - 1);
    return { source: H.mod(selected - shift, length) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { length: 5, shift: 2, selected: 0 },
  output: { source: 3 },
} satisfies ToolExample<Input, Output>;
export const listRotationSelectedIndexPreimageTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-rotation-selected-index-preimage",
    title: "List Rotation Selected Index Preimage Tool",
    description:
      "Calculate list rotation selected index preimage from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 1 },
        shift: { type: "integer" },
        selected: { type: "integer", minimum: 0 },
      },
      required: ["length", "shift", "selected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { source: { type: "integer" } },
      required: ["source"],
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
          id: "shift",
          label: "Shift",
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
      ],
    },
  },
  calculate,
});
export const run = listRotationSelectedIndexPreimageTool.execute;
export default listRotationSelectedIndexPreimageTool;
