import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dataBits: number;
  readonly parity: boolean;
  readonly stopBits: number;
};
export type Output = {
  readonly frameBits: number;
  readonly parityFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dataBits: { type: "integer", minimum: 5, maximum: 9 },
    parity: { type: "boolean" },
    stopBits: { type: "number" },
  },
  required: ["dataBits", "parity", "stopBits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameBits: { type: "number" },
    parityFraction: { type: "number" },
  },
  required: ["frameBits", "parityFraction"],
} as const;
/** Calculate uart parity frame bit contribution from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dataBits, parity, stopBits } = request;
  const compute = (): Output => {
    H.integer(dataBits, 5, 9);
    H.domain(stopBits === 1 || stopBits === 1.5 || stopBits === 2);
    const frameBits = 1 + dataBits + (parity ? 1 : 0) + stopBits;
    return { frameBits, parityFraction: parity ? 1 / frameBits : 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dataBits: 8, parity: true, stopBits: 1 },
  output: { frameBits: 11, parityFraction: 0.09090909090909091 },
} satisfies ToolExample<Input, Output>;
export const uartParityFrameBitContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/uart-parity-frame-bit-contribution",
    title: "Uart Parity Frame Bit Contribution Tool",
    description:
      "Calculate uart parity frame bit contribution from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dataBits: { type: "integer", minimum: 5, maximum: 9 },
        parity: { type: "boolean" },
        stopBits: { type: "number" },
      },
      required: ["dataBits", "parity", "stopBits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frameBits: { type: "number" },
        parityFraction: { type: "number" },
      },
      required: ["frameBits", "parityFraction"],
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
          id: "parity",
          label: "Parity",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "stopBits",
          label: "Stop Bits",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "frameBits", label: "Frame Bits", valueType: { type: "number" } },
        {
          id: "parityFraction",
          label: "Parity Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = uartParityFrameBitContributionTool.execute;
export default uartParityFrameBitContributionTool;
