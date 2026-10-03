import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsedDays: number;
  readonly allowedDays: number;
  readonly pausedDays: number;
  readonly pauseCredited: boolean;
};
export type Output = {
  readonly countedDays: number;
  readonly slackDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedDays: { type: "number", minimum: 0 },
    allowedDays: { type: "number", minimum: 0 },
    pausedDays: { type: "number", minimum: 0 },
    pauseCredited: { type: "boolean" },
  },
  required: ["elapsedDays", "allowedDays", "pausedDays", "pauseCredited"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedDays: { type: "number" },
    slackDays: { type: "number" },
  },
  required: ["countedDays", "slackDays"],
} as const;
/** Audit a caller-supplied administrative recall window without selecting screening guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsedDays, allowedDays, pausedDays, pauseCredited } = request;
  const compute = (): Output => {
    H.domain(
      elapsedDays >= 0 &&
        allowedDays >= 0 &&
        pausedDays >= 0 &&
        pausedDays <= elapsedDays,
    );
    return {
      countedDays: elapsedDays - (pauseCredited ? pausedDays : 0),
      slackDays: allowedDays - elapsedDays + (pauseCredited ? pausedDays : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    elapsedDays: 20,
    allowedDays: 30,
    pausedDays: 5,
    pauseCredited: true,
  },
  output: { countedDays: 15, slackDays: 15 },
} satisfies ToolExample<Input, Output>;
export const screeningRecallWindowSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-health/screening-recall-window-slack",
    title: "Screening Recall Window Slack Tool",
    description:
      "Audit a caller-supplied administrative recall window without selecting screening guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedDays: { type: "number", minimum: 0 },
        allowedDays: { type: "number", minimum: 0 },
        pausedDays: { type: "number", minimum: 0 },
        pauseCredited: { type: "boolean" },
      },
      required: ["elapsedDays", "allowedDays", "pausedDays", "pauseCredited"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedDays: { type: "number" },
        slackDays: { type: "number" },
      },
      required: ["countedDays", "slackDays"],
    },
    ports: {
      inputs: [
        {
          id: "elapsedDays",
          label: "Elapsed Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowedDays",
          label: "Allowed Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pausedDays",
          label: "Paused Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pauseCredited",
          label: "Pause Credited",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "countedDays",
          label: "Counted Days",
          valueType: { type: "number" },
        },
        { id: "slackDays", label: "Slack Days", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = screeningRecallWindowSlackTool.execute;
export default screeningRecallWindowSlackTool;
