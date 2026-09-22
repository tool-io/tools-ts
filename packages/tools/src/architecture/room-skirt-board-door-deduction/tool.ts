import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wallLengths: readonly number[];
  readonly doorWidths: readonly number[];
};
export type Output = { readonly length: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wallLengths: { type: "array", maxItems: 256, items: { type: "number" } },
    doorWidths: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["wallLengths", "doorWidths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { length: { type: "number" } },
  required: ["length"],
} as const;
/** Calculate room skirt board door deduction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wallLengths, doorWidths } = request;
  const compute = (): Output => {
    H.domain(
      wallLengths.every((x) => x >= 0) && doorWidths.every((x) => x >= 0),
    );
    H.domain(
      doorWidths.reduce((a, b) => a + b, 0) <=
        wallLengths.reduce((a, b) => a + b, 0),
    );
    return {
      length:
        wallLengths.reduce((a, b) => a + b, 0) -
        doorWidths.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wallLengths: [4, 5, 4, 5], doorWidths: [0.9, 0.8] },
  output: { length: 16.3 },
} satisfies ToolExample<Input, Output>;
export const roomSkirtBoardDoorDeductionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/room-skirt-board-door-deduction",
    title: "Room Skirt Board Door Deduction Tool",
    description:
      "Calculate room skirt board door deduction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wallLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        doorWidths: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["wallLengths", "doorWidths"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { length: { type: "number" } },
      required: ["length"],
    },
    ports: {
      inputs: [
        {
          id: "wallLengths",
          label: "Wall Lengths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "doorWidths",
          label: "Door Widths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "length", label: "Length", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = roomSkirtBoardDoorDeductionTool.execute;
export default roomSkirtBoardDoorDeductionTool;
