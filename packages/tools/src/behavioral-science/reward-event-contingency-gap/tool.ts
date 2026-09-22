import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventAt: number;
  readonly rewardAt: number;
  readonly expectedDelay: number;
};
export type Output = { readonly delay: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventAt: { type: "number" },
    rewardAt: { type: "number" },
    expectedDelay: { type: "number", minimum: 0 },
  },
  required: ["eventAt", "rewardAt", "expectedDelay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delay: { type: "number" }, residual: { type: "number" } },
  required: ["delay", "residual"],
} as const;
/** Calculate reward event contingency gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventAt, rewardAt, expectedDelay } = request;
  const compute = (): Output => {
    H.domain(expectedDelay >= 0);
    return {
      delay: rewardAt - eventAt,
      residual: rewardAt - eventAt - expectedDelay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventAt: 10, rewardAt: 14, expectedDelay: 3 },
  output: { delay: 4, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const rewardEventContingencyGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-science/reward-event-contingency-gap",
    title: "Reward Event Contingency Gap Tool",
    description:
      "Calculate reward event contingency gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventAt: { type: "number" },
        rewardAt: { type: "number" },
        expectedDelay: { type: "number", minimum: 0 },
      },
      required: ["eventAt", "rewardAt", "expectedDelay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { delay: { type: "number" }, residual: { type: "number" } },
      required: ["delay", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "eventAt",
          label: "Event At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rewardAt",
          label: "Reward At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expectedDelay",
          label: "Expected Delay",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "delay", label: "Delay", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rewardEventContingencyGapTool.execute;
export default rewardEventContingencyGapTool;
