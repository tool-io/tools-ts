import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dataBits: number;
  readonly parityBits: number;
  readonly stopHalfBits: number;
};
export type Output = {
  readonly frameHalfBits: number;
  readonly stopShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dataBits: { type: "integer", minimum: 5, maximum: 9 },
    parityBits: { type: "integer", minimum: 0, maximum: 1 },
    stopHalfBits: { type: "integer" },
  },
  required: ["dataBits", "parityBits", "stopHalfBits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameHalfBits: { type: "integer" },
    stopShare: { type: "number" },
  },
  required: ["frameHalfBits", "stopShare"],
} as const;
/** Asynchronous frame budget with one start bit and explicitly supplied half-bit stop slots. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dataBits, parityBits, stopHalfBits } = request;
  const compute = (): Output => {
    H.integer(dataBits, 5, 9);
    H.integer(parityBits, 0, 1);
    H.domain([2, 3, 4].includes(stopHalfBits));
    return {
      frameHalfBits: 2 * (1 + dataBits + parityBits) + stopHalfBits,
      stopShare:
        stopHalfBits / (2 * (1 + dataBits + parityBits) + stopHalfBits),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dataBits: 8, parityBits: 0, stopHalfBits: 2 },
  output: { frameHalfBits: 20, stopShare: 0.1 },
} satisfies ToolExample<Input, Output>;
export const uartStopBitHalfSlotBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/uart-stop-bit-half-slot-budget",
    title: "Uart Stop Bit Half Slot Budget Tool",
    description:
      "Asynchronous frame budget with one start bit and explicitly supplied half-bit stop slots.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dataBits: { type: "integer", minimum: 5, maximum: 9 },
        parityBits: { type: "integer", minimum: 0, maximum: 1 },
        stopHalfBits: { type: "integer" },
      },
      required: ["dataBits", "parityBits", "stopHalfBits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frameHalfBits: { type: "integer" },
        stopShare: { type: "number" },
      },
      required: ["frameHalfBits", "stopShare"],
    },
    ports: {
      inputs: [
        {
          id: "dataBits",
          label: "Data Bits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "parityBits",
          label: "Parity Bits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "stopHalfBits",
          label: "Stop Half Bits",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "frameHalfBits",
          label: "Frame Half Bits",
          valueType: { type: "integer" },
        },
        {
          id: "stopShare",
          label: "Stop Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = uartStopBitHalfSlotBudgetTool.execute;
export default uartStopBitHalfSlotBudgetTool;
