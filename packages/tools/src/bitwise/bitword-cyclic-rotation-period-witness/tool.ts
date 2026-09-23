import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly word: string;
  readonly width: number;
  readonly period: number;
};
export type Output = { readonly invariant: boolean; readonly rotated: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: { type: "string", maxLength: 8192 },
    width: { type: "integer", minimum: 1, maximum: 128 },
    period: { type: "integer", minimum: 1 },
  },
  required: ["word", "width", "period"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invariant: { type: "boolean" },
    rotated: { type: "string", maxLength: 8192 },
  },
  required: ["invariant", "rotated"],
} as const;
/** Compute bitword cyclic rotation period witness from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { word, width, period } = input;
  const compute = (): Output => {
    integer(width, 1, 128);
    integer(period, 1, width);
    const w = decimal(word),
      mask = (1n << BigInt(width)) - 1n;
    domain(w >= 0n && w <= mask);
    const p = BigInt(period % width),
      r = ((w << p) | (w >> BigInt(width - Number(p)))) & mask;
    return { invariant: r === w, rotated: r.toString() };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { word: "85", width: 8, period: 2 },
  output: { invariant: true, rotated: "85" },
} satisfies ToolExample<Input, Output>;
export const bitwordCyclicRotationPeriodWitnessTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "bitwise/bitword-cyclic-rotation-period-witness",
  title: "Bitword Cyclic Rotation Period Witness Tool",
  description:
    "Compute bitword cyclic rotation period witness from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "word",
        label: "Word",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "width",
        label: "Width",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "period",
        label: "Period",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "invariant", label: "Invariant", valueType: { type: "boolean" } },
      { id: "rotated", label: "Rotated", valueType: { type: "string" } },
    ],
  },
});
export const run = bitwordCyclicRotationPeriodWitnessTool.execute;
export default bitwordCyclicRotationPeriodWitnessTool;
