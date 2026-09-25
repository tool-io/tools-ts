import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly high: string; readonly low: string };
export type Output = { readonly byte: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    high: { type: "string", maxLength: 8192 },
    low: { type: "string", maxLength: 8192 },
  },
  required: ["high", "low"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { byte: { type: "integer" } },
  required: ["byte"],
} as const;
/** Calculate hex nibble pair reader from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { high, low } = request;
  const compute = (): Output => {
    H.domain(/^[0-9a-fA-F](?![\s\S])/.test(high), "high");
    H.domain(/^[0-9a-fA-F](?![\s\S])/.test(low), "low");
    return { byte: Number.parseInt(high + low, 16) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { high: "A", low: "f" },
  output: { byte: 175 },
} satisfies ToolExample<Input, Output>;
export const hexNibblePairReaderTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "decode/hex-nibble-pair-reader",
      title: "Hex Nibble Pair Reader Tool",
      description:
        "Calculate hex nibble pair reader from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          high: { type: "string", maxLength: 8192 },
          low: { type: "string", maxLength: 8192 },
        },
        required: ["high", "low"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { byte: { type: "integer" } },
        required: ["byte"],
      },
      ports: {
        inputs: [
          {
            id: "high",
            label: "High",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "low",
            label: "Low",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "byte", label: "Byte", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  },
);
export const run = hexNibblePairReaderTool.execute;
export default hexNibblePairReaderTool;
