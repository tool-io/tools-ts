import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly lowBits: number; readonly frameBits: number };
export type Output = {
  readonly breakDetected: boolean;
  readonly excessBits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowBits: { type: "number" },
    frameBits: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["lowBits", "frameBits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    breakDetected: { type: "boolean" },
    excessBits: { type: "number" },
  },
  required: ["breakDetected", "excessBits"],
} as const;
/** Compute uart break detection bit budget from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { lowBits, frameBits } = input;
  const compute = (): Output => {
    domain(lowBits >= 0);
    positive(frameBits);
    return {
      breakDetected: lowBits > frameBits,
      excessBits: Math.max(0, lowBits - frameBits),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lowBits: 12, frameBits: 10 },
  output: { breakDetected: true, excessBits: 2 },
} satisfies ToolExample<Input, Output>;
export const uartBreakDetectionBitBudgetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/uart-break-detection-bit-budget",
  title: "Uart Break Detection Bit Budget Tool",
  description:
    "Compute uart break detection bit budget from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "lowBits",
        label: "Low Bits",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "frameBits",
        label: "Frame Bits",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "breakDetected",
        label: "Break Detected",
        valueType: { type: "boolean" },
      },
      { id: "excessBits", label: "Excess Bits", valueType: { type: "number" } },
    ],
  },
});
export const run = uartBreakDetectionBitBudgetTool.execute;
export default uartBreakDetectionBitBudgetTool;
