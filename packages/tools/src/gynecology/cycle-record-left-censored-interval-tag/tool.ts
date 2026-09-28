import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationStart: number;
  readonly firstOnset: number;
  readonly priorOnset: number;
  readonly priorKnown: boolean;
};
export type Output = {
  readonly minimumDays: number;
  readonly exactDays: number;
  readonly exactPresent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationStart: { type: "integer" },
    firstOnset: { type: "integer" },
    priorOnset: { type: "integer" },
    priorKnown: { type: "boolean" },
  },
  required: ["observationStart", "firstOnset", "priorOnset", "priorKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumDays: { type: "integer" },
    exactDays: { type: "integer" },
    exactPresent: { type: "boolean" },
  },
  required: ["minimumDays", "exactDays", "exactPresent"],
} as const;
/** Report a left-censored onset interval; exactDays is zero when absent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationStart, firstOnset, priorOnset, priorKnown } = request;
  const compute = (): Output => {
    H.domain(
      firstOnset >= observationStart &&
        (!priorKnown || priorOnset <= observationStart),
      "priorOnset",
    );
    return {
      minimumDays: firstOnset - observationStart,
      exactDays: priorKnown ? firstOnset - priorOnset : 0,
      exactPresent: priorKnown,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationStart: 100,
    firstOnset: 120,
    priorOnset: 95,
    priorKnown: true,
  },
  output: { minimumDays: 20, exactDays: 25, exactPresent: true },
} satisfies ToolExample<Input, Output>;
export const cycleRecordLeftCensoredIntervalTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gynecology/cycle-record-left-censored-interval-tag",
    title: "Cycle Record Left Censored Interval Tag Tool",
    description:
      "Report a left-censored onset interval; exactDays is zero when absent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationStart: { type: "integer" },
        firstOnset: { type: "integer" },
        priorOnset: { type: "integer" },
        priorKnown: { type: "boolean" },
      },
      required: ["observationStart", "firstOnset", "priorOnset", "priorKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimumDays: { type: "integer" },
        exactDays: { type: "integer" },
        exactPresent: { type: "boolean" },
      },
      required: ["minimumDays", "exactDays", "exactPresent"],
    },
    ports: {
      inputs: [
        {
          id: "observationStart",
          label: "Observation Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstOnset",
          label: "First Onset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "priorOnset",
          label: "Prior Onset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "priorKnown",
          label: "Prior Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "minimumDays",
          label: "Minimum Days",
          valueType: { type: "integer" },
        },
        {
          id: "exactDays",
          label: "Exact Days",
          valueType: { type: "integer" },
        },
        {
          id: "exactPresent",
          label: "Exact Present",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = cycleRecordLeftCensoredIntervalTagTool.execute;
export default cycleRecordLeftCensoredIntervalTagTool;
