import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly transferWaitingMinutes: number;
  readonly totalCommuteMinutes: number;
};
export type Output = {
  readonly waitingFraction: number;
  readonly otherMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transferWaitingMinutes: { type: "number", minimum: 0 },
    totalCommuteMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["transferWaitingMinutes", "totalCommuteMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waitingFraction: { type: "number" },
    otherMinutes: { type: "number" },
  },
  required: ["waitingFraction", "otherMinutes"],
} as const;
/** Normalize explicit nonoverlapping transfer waiting time to a supplied commute duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { transferWaitingMinutes, totalCommuteMinutes } = request;
  const compute = (): Output => {
    (H.domain(totalCommuteMinutes > 0, "totalCommuteMinutes"),
      totalCommuteMinutes);
    H.domain(
      transferWaitingMinutes >= 0 &&
        transferWaitingMinutes <= totalCommuteMinutes,
      "transferWaitingMinutes",
    );
    return {
      waitingFraction: transferWaitingMinutes / totalCommuteMinutes,
      otherMinutes: totalCommuteMinutes - transferWaitingMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { transferWaitingMinutes: 15, totalCommuteMinutes: 60 },
  output: { waitingFraction: 0.25, otherMinutes: 45 },
} satisfies ToolExample<Input, Output>;
export const commuteTransferWaitShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["human-geography", "human geography", "social sciences"],
      keywords: ["human geography", "social sciences"],
    },
    id: "human-geography/commute-transfer-wait-share",
    title: "Commute Transfer Wait Share",
    description:
      "Normalize explicit nonoverlapping transfer waiting time to a supplied commute duration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        transferWaitingMinutes: { type: "number", minimum: 0 },
        totalCommuteMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["transferWaitingMinutes", "totalCommuteMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waitingFraction: { type: "number" },
        otherMinutes: { type: "number" },
      },
      required: ["waitingFraction", "otherMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "transferWaitingMinutes",
          label: "Transfer Waiting Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalCommuteMinutes",
          label: "Total Commute Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "waitingFraction",
          label: "Waiting Fraction",
          valueType: { type: "number" },
        },
        {
          id: "otherMinutes",
          label: "Other Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = commuteTransferWaitShareTool.execute;
export default commuteTransferWaitShareTool;
