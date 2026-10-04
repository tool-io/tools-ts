import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly connectionDuration: number;
  readonly transferDuration: number;
  readonly suppliedBuffer: number;
};
export type Output = { readonly slack: number; readonly slackToBuffer: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    connectionDuration: { type: "number", minimum: 0 },
    transferDuration: { type: "number", minimum: 0 },
    suppliedBuffer: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["connectionDuration", "transferDuration", "suppliedBuffer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slack: { type: "number" }, slackToBuffer: { type: "number" } },
  required: ["slack", "slackToBuffer"],
} as const;
/** Compare an explicit connection with supplied transfer and buffer times; no carrier rule or feasibility guarantee. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { connectionDuration, transferDuration, suppliedBuffer } = request;
  const compute = (): Output => {
    H.domain(connectionDuration >= 0 && transferDuration >= 0);
    H.positive(suppliedBuffer);
    return {
      slack: connectionDuration - transferDuration - suppliedBuffer,
      slackToBuffer:
        (connectionDuration - transferDuration - suppliedBuffer) /
        suppliedBuffer,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { connectionDuration: 60, transferDuration: 20, suppliedBuffer: 10 },
  output: { slack: 30, slackToBuffer: 3 },
} satisfies ToolExample<Input, Output>;
export const travelBufferSlackRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "tourism/travel-buffer-slack-ratio",
    title: "Travel Buffer Slack Ratio Tool",
    description:
      "Compare an explicit connection with supplied transfer and buffer times; no carrier rule or feasibility guarantee.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        connectionDuration: { type: "number", minimum: 0 },
        transferDuration: { type: "number", minimum: 0 },
        suppliedBuffer: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["connectionDuration", "transferDuration", "suppliedBuffer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slack: { type: "number" },
        slackToBuffer: { type: "number" },
      },
      required: ["slack", "slackToBuffer"],
    },
    ports: {
      inputs: [
        {
          id: "connectionDuration",
          label: "Connection Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transferDuration",
          label: "Transfer Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBuffer",
          label: "Supplied Buffer",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "slack", label: "Slack", valueType: { type: "number" } },
        {
          id: "slackToBuffer",
          label: "Slack To Buffer",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = travelBufferSlackRatioTool.execute;
export default travelBufferSlackRatioTool;
