import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly bits: number };
export type Output = { readonly nats: number; readonly hartleys: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bits: { type: "number" } },
  required: ["bits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nats: { type: "number" }, hartleys: { type: "number" } },
  required: ["nats", "hartleys"],
} as const;
/** Convert an explicit signed information quantity from bits to nats and hartleys without rounding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bits } = request;
  const compute = (): Output => {
    return { nats: bits * Math.LN2, hartleys: bits * Math.LOG10E * Math.LN2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bits: 1 },
  output: { nats: 0.6931471805599453, hartleys: 0.3010299956639812 },
} satisfies ToolExample<Input, Output>;
export const informationUnitOneBitReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["information", "information theory", "computer science"],
      keywords: ["information theory", "computer science"],
    },
    id: "information/information-unit-one-bit-reference",
    title: "Information Unit One Bit Reference",
    description:
      "Convert an explicit signed information quantity from bits to nats and hartleys without rounding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bits: { type: "number" } },
      required: ["bits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { nats: { type: "number" }, hartleys: { type: "number" } },
      required: ["nats", "hartleys"],
    },
    ports: {
      inputs: [
        {
          id: "bits",
          label: "Bits",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "nats", label: "Nats", valueType: { type: "number" } },
        { id: "hartleys", label: "Hartleys", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = informationUnitOneBitReferenceTool.execute;
export default informationUnitOneBitReferenceTool;
