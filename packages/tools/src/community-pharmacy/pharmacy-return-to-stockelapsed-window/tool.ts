import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly returnTime: number;
  readonly receiptTime: number;
  readonly nowTime: number;
  readonly allowedDuration: number;
};
export type Output = {
  readonly elapsed: number;
  readonly sinceReceipt: number;
  readonly remaining: number;
  readonly insideWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnTime: { type: "number" },
    receiptTime: { type: "number" },
    nowTime: { type: "number" },
    allowedDuration: { type: "number", minimum: 0 },
  },
  required: ["returnTime", "receiptTime", "nowTime", "allowedDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    sinceReceipt: { type: "number" },
    remaining: { type: "number" },
    insideWindow: { type: "boolean" },
  },
  required: ["elapsed", "sinceReceipt", "remaining", "insideWindow"],
} as const;
/** Audit explicit return-record timing without determining product usability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { returnTime, receiptTime, nowTime, allowedDuration } = request;
  const compute = (): Output => {
    H.domain(
      receiptTime <= returnTime &&
        returnTime <= nowTime &&
        allowedDuration >= 0,
    );
    return {
      elapsed: nowTime - returnTime,
      sinceReceipt: nowTime - receiptTime,
      remaining: allowedDuration - nowTime + returnTime,
      insideWindow: nowTime - returnTime <= allowedDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    returnTime: 100,
    receiptTime: 50,
    nowTime: 110,
    allowedDuration: 15,
  },
  output: { elapsed: 10, sinceReceipt: 60, remaining: 5, insideWindow: true },
} satisfies ToolExample<Input, Output>;
export const pharmacyReturnToStockelapsedWindowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-pharmacy/pharmacy-return-to-stockelapsed-window",
    title: "Pharmacy Return To Stockelapsed Window Tool",
    description:
      "Audit explicit return-record timing without determining product usability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        returnTime: { type: "number" },
        receiptTime: { type: "number" },
        nowTime: { type: "number" },
        allowedDuration: { type: "number", minimum: 0 },
      },
      required: ["returnTime", "receiptTime", "nowTime", "allowedDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        sinceReceipt: { type: "number" },
        remaining: { type: "number" },
        insideWindow: { type: "boolean" },
      },
      required: ["elapsed", "sinceReceipt", "remaining", "insideWindow"],
    },
    ports: {
      inputs: [
        {
          id: "returnTime",
          label: "Return Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "receiptTime",
          label: "Receipt Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nowTime",
          label: "Now Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowedDuration",
          label: "Allowed Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        {
          id: "sinceReceipt",
          label: "Since Receipt",
          valueType: { type: "number" },
        },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
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
export const run = pharmacyReturnToStockelapsedWindowTool.execute;
export default pharmacyReturnToStockelapsedWindowTool;
