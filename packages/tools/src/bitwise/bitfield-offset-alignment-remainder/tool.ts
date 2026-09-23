import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly offset: number; readonly alignment: number };
export type Output = {
  readonly remainder: number;
  readonly padding: number;
  readonly aligned: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offset: { type: "integer", minimum: 0 },
    alignment: { type: "integer", minimum: 1 },
  },
  required: ["offset", "alignment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainder: { type: "integer" },
    padding: { type: "integer" },
    aligned: { type: "boolean" },
  },
  required: ["remainder", "padding", "aligned"],
} as const;
/** Calculate bitfield offset alignment remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { offset, alignment } = request;
  const compute = (): Output => {
    H.integer(offset, 0);
    H.integer(alignment, 1);
    return {
      remainder: offset % alignment,
      padding: offset % alignment === 0 ? 0 : alignment - (offset % alignment),
      aligned: offset % alignment === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { offset: 13, alignment: 8 },
  output: { remainder: 5, padding: 3, aligned: false },
} satisfies ToolExample<Input, Output>;
export const bitfieldOffsetAlignmentRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/bitfield-offset-alignment-remainder",
    title: "Bitfield Offset Alignment Remainder Tool",
    description:
      "Calculate bitfield offset alignment remainder from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offset: { type: "integer", minimum: 0 },
        alignment: { type: "integer", minimum: 1 },
      },
      required: ["offset", "alignment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainder: { type: "integer" },
        padding: { type: "integer" },
        aligned: { type: "boolean" },
      },
      required: ["remainder", "padding", "aligned"],
    },
    ports: {
      inputs: [
        {
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "alignment",
          label: "Alignment",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "remainder", label: "Remainder", valueType: { type: "integer" } },
        { id: "padding", label: "Padding", valueType: { type: "integer" } },
        { id: "aligned", label: "Aligned", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = bitfieldOffsetAlignmentRemainderTool.execute;
export default bitfieldOffsetAlignmentRemainderTool;
