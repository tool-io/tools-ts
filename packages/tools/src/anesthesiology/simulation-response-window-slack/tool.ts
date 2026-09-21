import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseAt: number;
  readonly windowStart: number;
  readonly windowEnd: number;
};
export type Output = {
  readonly lowerSlack: number;
  readonly upperSlack: number;
  readonly inside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseAt: { type: "number" },
    windowStart: { type: "number" },
    windowEnd: { type: "number" },
  },
  required: ["responseAt", "windowStart", "windowEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerSlack: { type: "number" },
    upperSlack: { type: "number" },
    inside: { type: "boolean" },
  },
  required: ["lowerSlack", "upperSlack", "inside"],
} as const;
/** Compare explicit simulation response clocks to supplied inclusive bounds; no clinical response recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseAt, windowStart, windowEnd } = request;
  const compute = (): Output => {
    H.domain(windowEnd >= windowStart);
    return {
      lowerSlack: responseAt - windowStart,
      upperSlack: windowEnd - responseAt,
      inside: responseAt >= windowStart && responseAt <= windowEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responseAt: 15, windowStart: 10, windowEnd: 20 },
  output: { lowerSlack: 5, upperSlack: 5, inside: true },
} satisfies ToolExample<Input, Output>;
export const simulationResponseWindowSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anesthesiology/simulation-response-window-slack",
    title: "Simulation Response Window Slack Tool",
    description:
      "Compare explicit simulation response clocks to supplied inclusive bounds; no clinical response recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseAt: { type: "number" },
        windowStart: { type: "number" },
        windowEnd: { type: "number" },
      },
      required: ["responseAt", "windowStart", "windowEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerSlack: { type: "number" },
        upperSlack: { type: "number" },
        inside: { type: "boolean" },
      },
      required: ["lowerSlack", "upperSlack", "inside"],
    },
    ports: {
      inputs: [
        {
          id: "responseAt",
          label: "Response At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowStart",
          label: "Window Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowEnd",
          label: "Window End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lowerSlack",
          label: "Lower Slack",
          valueType: { type: "number" },
        },
        {
          id: "upperSlack",
          label: "Upper Slack",
          valueType: { type: "number" },
        },
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = simulationResponseWindowSlackTool.execute;
export default simulationResponseWindowSlackTool;
