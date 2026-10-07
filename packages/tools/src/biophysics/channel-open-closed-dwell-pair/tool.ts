import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openDwell: number;
  readonly closedDwell: number;
};
export type Output = {
  readonly cycleDuration: number;
  readonly openFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openDwell: { type: "number", minimum: 0 },
    closedDwell: { type: "number", minimum: 0 },
  },
  required: ["openDwell", "closedDwell"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleDuration: { type: "number" },
    openFraction: { type: "number" },
  },
  required: ["cycleDuration", "openFraction"],
} as const;
/** Combine explicit open and closed channel dwell durations for one positive cycle and its open fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openDwell, closedDwell } = request;
  const compute = (): Output => {
    H.domain(openDwell >= 0, "openDwell");
    H.domain(closedDwell >= 0 && openDwell + closedDwell > 0, "closedDwell");
    return {
      cycleDuration: openDwell + closedDwell,
      openFraction: openDwell / (openDwell + closedDwell),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openDwell: 3, closedDwell: 9 },
  output: { cycleDuration: 12, openFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const channelOpenClosedDwellPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biophysics", "physics"],
      keywords: ["biophysics", "physics"],
    },
    id: "biophysics/channel-open-closed-dwell-pair",
    title: "Channel Open Closed Dwell Pair",
    description:
      "Combine explicit open and closed channel dwell durations for one positive cycle and its open fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openDwell: { type: "number", minimum: 0 },
        closedDwell: { type: "number", minimum: 0 },
      },
      required: ["openDwell", "closedDwell"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycleDuration: { type: "number" },
        openFraction: { type: "number" },
      },
      required: ["cycleDuration", "openFraction"],
    },
    ports: {
      inputs: [
        {
          id: "openDwell",
          label: "Open Dwell",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "closedDwell",
          label: "Closed Dwell",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "cycleDuration",
          label: "Cycle Duration",
          valueType: { type: "number" },
        },
        {
          id: "openFraction",
          label: "Open Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = channelOpenClosedDwellPairTool.execute;
export default channelOpenClosedDwellPairTool;
