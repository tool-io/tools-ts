import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly start: number;
  readonly end: number;
  readonly fullWhenEqual: boolean;
};
export type Output = { readonly sliceLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 1 },
    start: { type: "integer", minimum: 0 },
    end: { type: "integer", minimum: 0 },
    fullWhenEqual: { type: "boolean" },
  },
  required: ["length", "start", "end", "fullWhenEqual"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sliceLength: { type: "integer" } },
  required: ["sliceLength"],
} as const;
/** Count a forward circular half-open index span with explicit equal-endpoint semantics. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, start, end, fullWhenEqual } = request;
  const compute = (): Output => {
    H.integer(length, 1);
    H.integer(start, 0, length - 1);
    H.integer(end, 0, length - 1);
    const n = BigInt(length),
      d = BigInt(end) - BigInt(start);
    return {
      sliceLength:
        start === end
          ? fullWhenEqual
            ? length
            : 0
          : Number(((d % n) + n) % n),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 8, start: 6, end: 2, fullWhenEqual: false },
  output: { sliceLength: 4 },
} satisfies ToolExample<Input, Output>;
export const listCircularSliceLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-circular-slice-length",
    title: "List Circular Slice Length Tool",
    description:
      "Count a forward circular half-open index span with explicit equal-endpoint semantics.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 1 },
        start: { type: "integer", minimum: 0 },
        end: { type: "integer", minimum: 0 },
        fullWhenEqual: { type: "boolean" },
      },
      required: ["length", "start", "end", "fullWhenEqual"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sliceLength: { type: "integer" } },
      required: ["sliceLength"],
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
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "end",
          label: "End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "fullWhenEqual",
          label: "Full When Equal",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "sliceLength",
          label: "Slice Length",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = listCircularSliceLengthTool.execute;
export default listCircularSliceLengthTool;
