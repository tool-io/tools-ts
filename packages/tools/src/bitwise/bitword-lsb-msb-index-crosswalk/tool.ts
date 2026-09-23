import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly width: number; readonly index: number };
export type Output = { readonly oppositeIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "integer", minimum: 1, maximum: 128 },
    index: { type: "integer", minimum: 0 },
  },
  required: ["width", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { oppositeIndex: { type: "integer" } },
  required: ["oppositeIndex"],
} as const;
/** Compute bitword lsb msb index crosswalk from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { width, index } = input;
  const compute = (): Output => {
    integer(width, 1, 128);
    integer(index, 0, width - 1);
    return { oppositeIndex: width - 1 - index };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { width: 8, index: 2 },
  output: { oppositeIndex: 5 },
} satisfies ToolExample<Input, Output>;
export const bitwordLsbMsbIndexCrosswalkTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "bitwise/bitword-lsb-msb-index-crosswalk",
  title: "Bitword Lsb Msb Index Crosswalk Tool",
  description:
    "Compute bitword lsb msb index crosswalk from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "width",
        label: "Width",
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
        id: "oppositeIndex",
        label: "Opposite Index",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = bitwordLsbMsbIndexCrosswalkTool.execute;
export default bitwordLsbMsbIndexCrosswalkTool;
