import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryTime: number;
  readonly exitTime: number;
  readonly eventTime: number;
  readonly entryInclusive: boolean;
  readonly exitInclusive: boolean;
};
export type Output = { readonly atRisk: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryTime: { type: "number" },
    exitTime: { type: "number" },
    eventTime: { type: "number" },
    entryInclusive: { type: "boolean" },
    exitInclusive: { type: "boolean" },
  },
  required: [
    "entryTime",
    "exitTime",
    "eventTime",
    "entryInclusive",
    "exitInclusive",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { atRisk: { type: "boolean" } },
  required: ["atRisk"],
} as const;
/** Risk-set membership under explicitly supplied entry and exit equality conventions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryTime, exitTime, eventTime, entryInclusive, exitInclusive } =
    request;
  const compute = (): Output => {
    H.domain(exitTime >= entryTime);
    return {
      atRisk:
        (entryInclusive ? eventTime >= entryTime : eventTime > entryTime) &&
        (exitInclusive ? eventTime <= exitTime : eventTime < exitTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    entryTime: 10,
    exitTime: 20,
    eventTime: 10,
    entryInclusive: false,
    exitInclusive: true,
  },
  output: { atRisk: false },
} satisfies ToolExample<Input, Output>;
export const riskSetLeftEntryEqualityFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biostatistics/risk-set-left-entry-equality-flag",
    title: "Risk Set Left Entry Equality Flag Tool",
    description:
      "Risk-set membership under explicitly supplied entry and exit equality conventions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryTime: { type: "number" },
        exitTime: { type: "number" },
        eventTime: { type: "number" },
        entryInclusive: { type: "boolean" },
        exitInclusive: { type: "boolean" },
      },
      required: [
        "entryTime",
        "exitTime",
        "eventTime",
        "entryInclusive",
        "exitInclusive",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { atRisk: { type: "boolean" } },
      required: ["atRisk"],
    },
    ports: {
      inputs: [
        {
          id: "entryTime",
          label: "Entry Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exitTime",
          label: "Exit Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eventTime",
          label: "Event Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "entryInclusive",
          label: "Entry Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "exitInclusive",
          label: "Exit Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "atRisk", label: "At Risk", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = riskSetLeftEntryEqualityFlagTool.execute;
export default riskSetLeftEntryEqualityFlagTool;
