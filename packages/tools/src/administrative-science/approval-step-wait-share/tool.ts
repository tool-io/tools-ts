import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly processingTime: number;
  readonly waitingTime: number;
  readonly excludedWait: number;
};
export type Output = {
  readonly countedTotal: number;
  readonly waitShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    processingTime: { type: "number", minimum: 0 },
    waitingTime: { type: "number", minimum: 0 },
    excludedWait: { type: "number", minimum: 0 },
  },
  required: ["processingTime", "waitingTime", "excludedWait"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedTotal: { type: "number" },
    waitShare: { type: "number" },
  },
  required: ["countedTotal", "waitShare"],
} as const;
/** Calculate approval step wait share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { processingTime, waitingTime, excludedWait } = request;
  const compute = (): Output => {
    H.domain(
      processingTime >= 0 &&
        waitingTime >= 0 &&
        excludedWait >= 0 &&
        excludedWait <= waitingTime &&
        processingTime + waitingTime > excludedWait,
    );
    return {
      countedTotal: processingTime + waitingTime - excludedWait,
      waitShare:
        (waitingTime - excludedWait) /
        (processingTime + waitingTime - excludedWait),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { processingTime: 20, waitingTime: 40, excludedWait: 10 },
  output: { countedTotal: 50, waitShare: 0.6 },
} satisfies ToolExample<Input, Output>;
export const approvalStepWaitShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "administrative-science/approval-step-wait-share",
    title: "Approval Step Wait Share Tool",
    description:
      "Calculate approval step wait share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        processingTime: { type: "number", minimum: 0 },
        waitingTime: { type: "number", minimum: 0 },
        excludedWait: { type: "number", minimum: 0 },
      },
      required: ["processingTime", "waitingTime", "excludedWait"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedTotal: { type: "number" },
        waitShare: { type: "number" },
      },
      required: ["countedTotal", "waitShare"],
    },
    ports: {
      inputs: [
        {
          id: "processingTime",
          label: "Processing Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waitingTime",
          label: "Waiting Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedWait",
          label: "Excluded Wait",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "countedTotal",
          label: "Counted Total",
          valueType: { type: "number" },
        },
        { id: "waitShare", label: "Wait Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = approvalStepWaitShareTool.execute;
export default approvalStepWaitShareTool;
