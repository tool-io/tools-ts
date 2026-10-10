import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationSeconds: number;
  readonly chartEntrySeconds: number;
};
export type Output = {
  readonly signedDelaySeconds: number;
  readonly retrospective: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationSeconds: { type: "number" },
    chartEntrySeconds: { type: "number" },
  },
  required: ["observationSeconds", "chartEntrySeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDelaySeconds: { type: "number" },
    retrospective: { type: "boolean" },
  },
  required: ["signedDelaySeconds", "retrospective"],
} as const;
/** Compare explicit observation and chart-entry timestamps without inferring care timing or documentation compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationSeconds, chartEntrySeconds } = request;
  const compute = (): Output => {
    return {
      signedDelaySeconds: chartEntrySeconds - observationSeconds,
      retrospective: chartEntrySeconds > observationSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationSeconds: 100, chartEntrySeconds: 145 },
  output: { signedDelaySeconds: 45, retrospective: true },
} satisfies ToolExample<Input, Output>;
export const nursingObservationChartingDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["nursing", "health and medicine"],
      keywords: ["nursing", "health and medicine"],
    },
    id: "nursing/nursing-observation-charting-delay",
    title: "Nursing Observation Charting Delay",
    description:
      "Compare explicit observation and chart-entry timestamps without inferring care timing or documentation compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationSeconds: { type: "number" },
        chartEntrySeconds: { type: "number" },
      },
      required: ["observationSeconds", "chartEntrySeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedDelaySeconds: { type: "number" },
        retrospective: { type: "boolean" },
      },
      required: ["signedDelaySeconds", "retrospective"],
    },
    ports: {
      inputs: [
        {
          id: "observationSeconds",
          label: "Observation Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "chartEntrySeconds",
          label: "Chart Entry Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedDelaySeconds",
          label: "Signed Delay Seconds",
          valueType: { type: "number" },
        },
        {
          id: "retrospective",
          label: "Retrospective",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = nursingObservationChartingDelayTool.execute;
export default nursingObservationChartingDelayTool;
