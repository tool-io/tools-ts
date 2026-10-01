import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sent: number;
  readonly received: number;
  readonly readback: number;
  readonly clockOffset: number;
  readonly suppliedWindow: number;
};
export type Output = {
  readonly deliveryDelay: number;
  readonly readbackDelay: number;
  readonly totalDelay: number;
  readonly insideWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sent: { type: "number" },
    received: { type: "number" },
    readback: { type: "number" },
    clockOffset: { type: "number" },
    suppliedWindow: { type: "number", minimum: 0 },
  },
  required: ["sent", "received", "readback", "clockOffset", "suppliedWindow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deliveryDelay: { type: "number" },
    readbackDelay: { type: "number" },
    totalDelay: { type: "number" },
    insideWindow: { type: "boolean" },
  },
  required: ["deliveryDelay", "readbackDelay", "totalDelay", "insideWindow"],
} as const;
/** Calculate nursing handover readback delay term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sent, received, readback, clockOffset, suppliedWindow } = request;
  const compute = (): Output => {
    H.domain(
      received - clockOffset >= sent &&
        readback >= received &&
        suppliedWindow >= 0,
    );
    return {
      deliveryDelay: received - clockOffset - sent,
      readbackDelay: readback - received,
      totalDelay: readback - clockOffset - sent,
      insideWindow: readback - clockOffset - sent <= suppliedWindow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sent: 100,
    received: 104,
    readback: 110,
    clockOffset: 1,
    suppliedWindow: 12,
  },
  output: {
    deliveryDelay: 3,
    readbackDelay: 6,
    totalDelay: 9,
    insideWindow: true,
  },
} satisfies ToolExample<Input, Output>;
export const nursingHandoverReadbackDelayTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nursing/nursing-handover-readback-delay-term",
    title: "Nursing Handover Readback Delay Term Tool",
    description:
      "Calculate nursing handover readback delay term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sent: { type: "number" },
        received: { type: "number" },
        readback: { type: "number" },
        clockOffset: { type: "number" },
        suppliedWindow: { type: "number", minimum: 0 },
      },
      required: [
        "sent",
        "received",
        "readback",
        "clockOffset",
        "suppliedWindow",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deliveryDelay: { type: "number" },
        readbackDelay: { type: "number" },
        totalDelay: { type: "number" },
        insideWindow: { type: "boolean" },
      },
      required: [
        "deliveryDelay",
        "readbackDelay",
        "totalDelay",
        "insideWindow",
      ],
    },
    ports: {
      inputs: [
        {
          id: "sent",
          label: "Sent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "received",
          label: "Received",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "readback",
          label: "Readback",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clockOffset",
          label: "Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWindow",
          label: "Supplied Window",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "deliveryDelay",
          label: "Delivery Delay",
          valueType: { type: "number" },
        },
        {
          id: "readbackDelay",
          label: "Readback Delay",
          valueType: { type: "number" },
        },
        {
          id: "totalDelay",
          label: "Total Delay",
          valueType: { type: "number" },
        },
        {
          id: "insideWindow",
          label: "Inside Window",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = nursingHandoverReadbackDelayTermTool.execute;
export default nursingHandoverReadbackDelayTermTool;
