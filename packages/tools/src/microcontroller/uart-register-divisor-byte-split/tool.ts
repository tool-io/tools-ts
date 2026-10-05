import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly divisor: number };
export type Output = { readonly highByte: number; readonly lowByte: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { divisor: { type: "integer", minimum: 0, maximum: 65535 } },
  required: ["divisor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { highByte: { type: "integer" }, lowByte: { type: "integer" } },
  required: ["highByte", "lowByte"],
} as const;
/** Split a caller-computed unsigned 16-bit UART divisor register value into high and low bytes; no hardware clock model is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { divisor } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(divisor) && divisor >= 0 && divisor <= 65535,
      "divisor",
    ),
      divisor);
    return { highByte: Math.floor(divisor / 256), lowByte: divisor % 256 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { divisor: 4660 },
  output: { highByte: 18, lowByte: 52 },
} satisfies ToolExample<Input, Output>;
export const uartRegisterDivisorByteSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/uart-register-divisor-byte-split",
    title: "Uart Register Divisor Byte Split Tool",
    description:
      "Split a caller-computed unsigned 16-bit UART divisor register value into high and low bytes; no hardware clock model is assumed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { divisor: { type: "integer", minimum: 0, maximum: 65535 } },
      required: ["divisor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        highByte: { type: "integer" },
        lowByte: { type: "integer" },
      },
      required: ["highByte", "lowByte"],
    },
    ports: {
      inputs: [
        {
          id: "divisor",
          label: "Divisor",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "highByte", label: "High Byte", valueType: { type: "integer" } },
        { id: "lowByte", label: "Low Byte", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = uartRegisterDivisorByteSplitTool.execute;
export default uartRegisterDivisorByteSplitTool;
