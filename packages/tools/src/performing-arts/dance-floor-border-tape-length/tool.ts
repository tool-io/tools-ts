import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly length: number;
  readonly joins: number;
  readonly overlapPerJoin: number;
};
export type Output = {
  readonly perimeter: number;
  readonly tapeLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", minimum: 0 },
    length: { type: "number", minimum: 0 },
    joins: { type: "integer", minimum: 0 },
    overlapPerJoin: { type: "number", minimum: 0 },
  },
  required: ["width", "length", "joins", "overlapPerJoin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { perimeter: { type: "number" }, tapeLength: { type: "number" } },
  required: ["perimeter", "tapeLength"],
} as const;
/** Calculate dance floor border tape length from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, length, joins, overlapPerJoin } = request;
  const compute = (): Output => {
    H.domain(width >= 0 && length >= 0 && overlapPerJoin >= 0);
    H.integer(joins, 0);
    return {
      perimeter: 2 * (width + length),
      tapeLength: 2 * (width + length) + joins * overlapPerJoin,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { width: 10, length: 8, joins: 4, overlapPerJoin: 0.1 },
  output: { perimeter: 36, tapeLength: 36.4 },
} satisfies ToolExample<Input, Output>;
export const danceFloorBorderTapeLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/dance-floor-border-tape-length",
    title: "Dance Floor Border Tape Length Tool",
    description:
      "Calculate dance floor border tape length from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", minimum: 0 },
        length: { type: "number", minimum: 0 },
        joins: { type: "integer", minimum: 0 },
        overlapPerJoin: { type: "number", minimum: 0 },
      },
      required: ["width", "length", "joins", "overlapPerJoin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        perimeter: { type: "number" },
        tapeLength: { type: "number" },
      },
      required: ["perimeter", "tapeLength"],
    },
    ports: {
      inputs: [
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "joins",
          label: "Joins",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "overlapPerJoin",
          label: "Overlap Per Join",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "perimeter", label: "Perimeter", valueType: { type: "number" } },
        {
          id: "tapeLength",
          label: "Tape Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = danceFloorBorderTapeLengthTool.execute;
export default danceFloorBorderTapeLengthTool;
