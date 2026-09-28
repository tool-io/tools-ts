import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly serviceStart: number;
  readonly serviceEnd: number;
  readonly scheduleStart: number;
  readonly scheduleEnd: number;
  readonly reimbursableRate: number;
};
export type Output = {
  readonly supportedDuration: number;
  readonly unsupportedDuration: number;
  readonly supportedAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    serviceStart: { type: "number" },
    serviceEnd: { type: "number" },
    scheduleStart: { type: "number" },
    scheduleEnd: { type: "number" },
    reimbursableRate: { type: "number", minimum: 0 },
  },
  required: [
    "serviceStart",
    "serviceEnd",
    "scheduleStart",
    "scheduleEnd",
    "reimbursableRate",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supportedDuration: { type: "number" },
    unsupportedDuration: { type: "number" },
    supportedAmount: { type: "number" },
  },
  required: ["supportedDuration", "unsupportedDuration", "supportedAmount"],
} as const;
/** Calculate reimbursement source period gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    serviceStart,
    serviceEnd,
    scheduleStart,
    scheduleEnd,
    reimbursableRate,
  } = request;
  const compute = (): Output => {
    H.domain(
      serviceEnd >= serviceStart &&
        scheduleEnd >= scheduleStart &&
        reimbursableRate >= 0,
    );
    return (() => {
      const supportedDuration = Math.max(
        0,
        Math.min(serviceEnd, scheduleEnd) -
          Math.max(serviceStart, scheduleStart),
      );
      return {
        supportedDuration,
        unsupportedDuration: serviceEnd - serviceStart - supportedDuration,
        supportedAmount: supportedDuration * reimbursableRate,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    serviceStart: 0,
    serviceEnd: 10,
    scheduleStart: 2,
    scheduleEnd: 8,
    reimbursableRate: 5,
  },
  output: { supportedDuration: 6, unsupportedDuration: 4, supportedAmount: 30 },
} satisfies ToolExample<Input, Output>;
export const reimbursementSourcePeriodGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/reimbursement-source-period-gap",
    title: "Reimbursement Source Period Gap Tool",
    description:
      "Calculate reimbursement source period gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        serviceStart: { type: "number" },
        serviceEnd: { type: "number" },
        scheduleStart: { type: "number" },
        scheduleEnd: { type: "number" },
        reimbursableRate: { type: "number", minimum: 0 },
      },
      required: [
        "serviceStart",
        "serviceEnd",
        "scheduleStart",
        "scheduleEnd",
        "reimbursableRate",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supportedDuration: { type: "number" },
        unsupportedDuration: { type: "number" },
        supportedAmount: { type: "number" },
      },
      required: ["supportedDuration", "unsupportedDuration", "supportedAmount"],
    },
    ports: {
      inputs: [
        {
          id: "serviceStart",
          label: "Service Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "serviceEnd",
          label: "Service End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scheduleStart",
          label: "Schedule Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scheduleEnd",
          label: "Schedule End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reimbursableRate",
          label: "Reimbursable Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "supportedDuration",
          label: "Supported Duration",
          valueType: { type: "number" },
        },
        {
          id: "unsupportedDuration",
          label: "Unsupported Duration",
          valueType: { type: "number" },
        },
        {
          id: "supportedAmount",
          label: "Supported Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reimbursementSourcePeriodGapTool.execute;
export default reimbursementSourcePeriodGapTool;
