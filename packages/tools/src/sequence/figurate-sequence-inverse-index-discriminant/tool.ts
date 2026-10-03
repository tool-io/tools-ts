import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sides: number; readonly value: number };
export type Output = {
  readonly discriminant: string;
  readonly index: number;
  readonly integralIndex: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sides: { type: "integer", minimum: 3, maximum: 1000 },
    value: { type: "integer", minimum: 0, maximum: 1000000 },
  },
  required: ["sides", "value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discriminant: { type: "string", maxLength: 8192 },
    index: { type: "number" },
    integralIndex: { type: "boolean" },
  },
  required: ["discriminant", "index", "integralIndex"],
} as const;
/** Calculate figurate sequence inverse index discriminant from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sides, value } = request;
  const compute = (): Output => {
    H.integer(sides, 3, 1000);
    H.integer(value, 0, 1000000);
    const a = sides - 2,
      b = sides - 4,
      d = BigInt(b) * BigInt(b) + 8n * BigInt(a) * BigInt(value),
      index = value === 0 ? 0 : (b + Math.sqrt(Number(d))) / (2 * a);
    return {
      discriminant: String(d),
      index,
      integralIndex: Number.isInteger(index),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sides: 3, value: 15 },
  output: { discriminant: "121", index: 5, integralIndex: true },
} satisfies ToolExample<Input, Output>;
export const figurateSequenceInverseIndexDiscriminantTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "sequence/figurate-sequence-inverse-index-discriminant",
      title: "Figurate Sequence Inverse Index Discriminant Tool",
      description:
        "Calculate figurate sequence inverse index discriminant from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sides: { type: "integer", minimum: 3, maximum: 1000 },
          value: { type: "integer", minimum: 0, maximum: 1000000 },
        },
        required: ["sides", "value"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          discriminant: { type: "string", maxLength: 8192 },
          index: { type: "number" },
          integralIndex: { type: "boolean" },
        },
        required: ["discriminant", "index", "integralIndex"],
      },
      ports: {
        inputs: [
          {
            id: "sides",
            label: "Sides",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "value",
            label: "Value",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "discriminant",
            label: "Discriminant",
            valueType: { type: "string" },
          },
          { id: "index", label: "Index", valueType: { type: "number" } },
          {
            id: "integralIndex",
            label: "Integral Index",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = figurateSequenceInverseIndexDiscriminantTool.execute;
export default figurateSequenceInverseIndexDiscriminantTool;
