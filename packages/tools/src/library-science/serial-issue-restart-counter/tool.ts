import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previous: number;
  readonly current: number;
  readonly volumeChanged: boolean;
  readonly explicitRestart: boolean;
};
export type Output = { readonly restart: boolean; readonly delta: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previous: { type: "integer", minimum: 0 },
    current: { type: "integer", minimum: 0 },
    volumeChanged: { type: "boolean" },
    explicitRestart: { type: "boolean" },
  },
  required: ["previous", "current", "volumeChanged", "explicitRestart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { restart: { type: "boolean" }, delta: { type: "integer" } },
  required: ["restart", "delta"],
} as const;
/** Flag a caller-authorized issue-number restart rather than silently treating it as a missing issue. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previous, current, volumeChanged, explicitRestart } = request;
  const compute = (): Output => {
    H.integer(previous, 0);
    H.integer(current, 0);
    return {
      restart: explicitRestart || (volumeChanged && current < previous),
      delta: current - previous,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previous: 12,
    current: 1,
    volumeChanged: true,
    explicitRestart: false,
  },
  output: { restart: true, delta: -11 },
} satisfies ToolExample<Input, Output>;
export const serialIssueRestartCounterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/serial-issue-restart-counter",
    title: "Serial Issue Restart Counter Tool",
    description:
      "Flag a caller-authorized issue-number restart rather than silently treating it as a missing issue.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previous: { type: "integer", minimum: 0 },
        current: { type: "integer", minimum: 0 },
        volumeChanged: { type: "boolean" },
        explicitRestart: { type: "boolean" },
      },
      required: ["previous", "current", "volumeChanged", "explicitRestart"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { restart: { type: "boolean" }, delta: { type: "integer" } },
      required: ["restart", "delta"],
    },
    ports: {
      inputs: [
        {
          id: "previous",
          label: "Previous",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "current",
          label: "Current",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "volumeChanged",
          label: "Volume Changed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "explicitRestart",
          label: "Explicit Restart",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "restart", label: "Restart", valueType: { type: "boolean" } },
        { id: "delta", label: "Delta", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = serialIssueRestartCounterTool.execute;
export default serialIssueRestartCounterTool;
