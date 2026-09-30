import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly from: number;
  readonly to: number;
  readonly selected: number;
};
export type Output = { readonly index: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 1 },
    from: { type: "integer" },
    to: { type: "integer" },
    selected: { type: "integer" },
  },
  required: ["length", "from", "to", "selected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { index: { type: "integer" } },
  required: ["index"],
} as const;
/** Calculate list index after stable move from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { length, from, to, selected } = input;
  const compute = (): Output => {
    H.integer(length, 1);
    for (const x of [from, to, selected]) H.integer(x, 0, length - 1);
    return {
      index:
        selected === from
          ? to
          : from < to && selected > from && selected <= to
            ? selected - 1
            : from > to && selected >= to && selected < from
              ? selected + 1
              : selected,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { length: 6, from: 1, to: 4, selected: 3 },
  output: { index: 2 },
} satisfies ToolExample<Input, Output>;
export const listIndexAfterStableMoveTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-index-after-stable-move",
    title: "List Index After Stable Move Tool",
    description:
      "Calculate list index after stable move from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 1 },
        from: { type: "integer" },
        to: { type: "integer" },
        selected: { type: "integer" },
      },
      required: ["length", "from", "to", "selected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { index: { type: "integer" } },
      required: ["index"],
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
          id: "from",
          label: "From",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "to",
          label: "To",
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
        { id: "index", label: "Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = listIndexAfterStableMoveTool.execute;
export default listIndexAfterStableMoveTool;
