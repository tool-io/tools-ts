import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly simpleValue: number };
export type Output = { readonly octets: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { simpleValue: { type: "integer", minimum: 0, maximum: 255 } },
  required: ["simpleValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    octets: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["octets"],
} as const;
/** Encode one CBOR simple value, rejecting the reserved simple values 24..31. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { simpleValue } = input;
  const compute = (): Output => {
    H.integer(simpleValue, 0, 255);
    H.domain(simpleValue < 24 || simpleValue >= 32);
    return {
      octets: simpleValue < 24 ? [224 + simpleValue] : [248, simpleValue],
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { simpleValue: 21 },
  output: { octets: [245] },
} satisfies ToolExample<Input, Output>;
export const cborSimpleValueInitialOctetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/cbor-simple-value-initial-octet",
    title: "CBOR Simple Value Initial Octet Tool",
    description:
      "Encode one CBOR simple value, rejecting the reserved simple values 24..31.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        simpleValue: { type: "integer", minimum: 0, maximum: 255 },
      },
      required: ["simpleValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        octets: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["octets"],
    },
    ports: {
      inputs: [
        {
          id: "simpleValue",
          label: "Simple Value",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "octets",
          label: "Octets",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = cborSimpleValueInitialOctetTool.execute;
export default cborSimpleValueInitialOctetTool;
