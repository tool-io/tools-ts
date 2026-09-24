import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly length: number; readonly rotation: number };
export type Output = { readonly cycles: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 1, maximum: 1000000 },
    rotation: { type: "integer" },
  },
  required: ["length", "rotation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cycles: { type: "integer" } },
  required: ["cycles"],
} as const;
/** Calculate necklace rotation fixed position count from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { length, rotation } = input;
  const compute = (): Output => {
    H.integer(length, 1, 1000000);
    let a = length,
      b = H.mod(rotation, length);
    while (b) {
      const t = a % b;
      a = b;
      b = t;
    }
    return { cycles: a };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { length: 12, rotation: 8 },
  output: { cycles: 4 },
} satisfies ToolExample<Input, Output>;
export const necklaceRotationFixedPositionCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/necklace-rotation-fixed-position-count",
    title: "Necklace Rotation Fixed Position Count Tool",
    description:
      "Calculate necklace rotation fixed position count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 1, maximum: 1000000 },
        rotation: { type: "integer" },
      },
      required: ["length", "rotation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cycles: { type: "integer" } },
      required: ["cycles"],
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
          id: "rotation",
          label: "Rotation",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "cycles", label: "Cycles", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = necklaceRotationFixedPositionCountTool.execute;
export default necklaceRotationFixedPositionCountTool;
