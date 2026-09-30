import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly clock: number;
  readonly baud: number;
  readonly oversampling: number;
  readonly divider: number;
};
export type Output = {
  readonly actualBaud: number;
  readonly relativeError: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clock: { type: "number", exclusiveMinimum: 0 },
    baud: { type: "number", exclusiveMinimum: 0 },
    oversampling: { type: "integer", minimum: 1 },
    divider: { type: "integer", minimum: 1 },
  },
  required: ["clock", "baud", "oversampling", "divider"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualBaud: { type: "number" },
    relativeError: { type: "number" },
  },
  required: ["actualBaud", "relativeError"],
} as const;
/** Calculate uart oversampling divider error from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { clock, baud, oversampling, divider } = input;
  const compute = (): Output => {
    H.positive(clock);
    H.positive(baud);
    H.integer(oversampling, 1);
    H.integer(divider, 1);
    const actualBaud = clock / (oversampling * divider);
    return { actualBaud, relativeError: actualBaud / baud - 1 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { clock: 16000000, baud: 100000, oversampling: 16, divider: 10 },
  output: { actualBaud: 100000, relativeError: 0 },
} satisfies ToolExample<Input, Output>;
export const uartOversamplingDividerErrorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/uart-oversampling-divider-error",
    title: "Uart Oversampling Divider Error Tool",
    description:
      "Calculate uart oversampling divider error from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clock: { type: "number", exclusiveMinimum: 0 },
        baud: { type: "number", exclusiveMinimum: 0 },
        oversampling: { type: "integer", minimum: 1 },
        divider: { type: "integer", minimum: 1 },
      },
      required: ["clock", "baud", "oversampling", "divider"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualBaud: { type: "number" },
        relativeError: { type: "number" },
      },
      required: ["actualBaud", "relativeError"],
    },
    ports: {
      inputs: [
        {
          id: "clock",
          label: "Clock",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baud",
          label: "Baud",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oversampling",
          label: "Oversampling",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "divider",
          label: "Divider",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "actualBaud",
          label: "Actual Baud",
          valueType: { type: "number" },
        },
        {
          id: "relativeError",
          label: "Relative Error",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = uartOversamplingDividerErrorTool.execute;
export default uartOversamplingDividerErrorTool;
