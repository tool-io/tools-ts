import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actualBaud: number;
  readonly targetBaud: number;
  readonly receiverToleranceFraction: number;
};
export type Output = {
  readonly relativeError: number;
  readonly direction: number;
  readonly withinSuppliedTolerance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualBaud: { type: "number", exclusiveMinimum: 0 },
    targetBaud: { type: "number", exclusiveMinimum: 0 },
    receiverToleranceFraction: { type: "number", minimum: 0 },
  },
  required: ["actualBaud", "targetBaud", "receiverToleranceFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeError: { type: "number" },
    direction: { type: "integer" },
    withinSuppliedTolerance: { type: "boolean" },
  },
  required: ["relativeError", "direction", "withinSuppliedTolerance"],
} as const;
/** Report signed baud error against a caller-supplied receiver tolerance, without hardware recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actualBaud, targetBaud, receiverToleranceFraction } = request;
  const compute = (): Output => {
    H.positive(actualBaud);
    H.positive(targetBaud);
    H.domain(receiverToleranceFraction >= 0);
    return {
      relativeError: (actualBaud - targetBaud) / targetBaud,
      direction: Math.sign(actualBaud - targetBaud),
      withinSuppliedTolerance:
        Math.abs((actualBaud - targetBaud) / targetBaud) <=
        receiverToleranceFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    actualBaud: 10100,
    targetBaud: 10000,
    receiverToleranceFraction: 0.02,
  },
  output: { relativeError: 0.01, direction: 1, withinSuppliedTolerance: true },
} satisfies ToolExample<Input, Output>;
export const uartClockErrorSignTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "microcontroller/uart-clock-error-sign",
    title: "Uart Clock Error Sign Tool",
    description:
      "Report signed baud error against a caller-supplied receiver tolerance, without hardware recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualBaud: { type: "number", exclusiveMinimum: 0 },
        targetBaud: { type: "number", exclusiveMinimum: 0 },
        receiverToleranceFraction: { type: "number", minimum: 0 },
      },
      required: ["actualBaud", "targetBaud", "receiverToleranceFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeError: { type: "number" },
        direction: { type: "integer" },
        withinSuppliedTolerance: { type: "boolean" },
      },
      required: ["relativeError", "direction", "withinSuppliedTolerance"],
    },
    ports: {
      inputs: [
        {
          id: "actualBaud",
          label: "Actual Baud",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetBaud",
          label: "Target Baud",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "receiverToleranceFraction",
          label: "Receiver Tolerance Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeError",
          label: "Relative Error",
          valueType: { type: "number" },
        },
        { id: "direction", label: "Direction", valueType: { type: "integer" } },
        {
          id: "withinSuppliedTolerance",
          label: "Within Supplied Tolerance",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = uartClockErrorSignTool.execute;
export default uartClockErrorSignTool;
