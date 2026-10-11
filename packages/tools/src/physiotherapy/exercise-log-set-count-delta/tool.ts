import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedSets: number;
  readonly recordedSets: number;
};
export type Output = {
  readonly recordedMinusPlanned: number;
  readonly remainingSets: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedSets: { type: "integer", minimum: 0 },
    recordedSets: { type: "integer", minimum: 0 },
  },
  required: ["plannedSets", "recordedSets"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedMinusPlanned: { type: "integer" },
    remainingSets: { type: "integer" },
  },
  required: ["recordedMinusPlanned", "remainingSets"],
} as const;
/** Compare explicit planned and recorded exercise set counts without prescribing exercise volume. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedSets, recordedSets } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(plannedSets) &&
        plannedSets >= 0 &&
        plannedSets <= Number.MAX_SAFE_INTEGER,
      "plannedSets",
    ),
      plannedSets);
    (H.domain(
      Number.isSafeInteger(recordedSets) &&
        recordedSets >= 0 &&
        recordedSets <= Number.MAX_SAFE_INTEGER,
      "recordedSets",
    ),
      recordedSets);
    return {
      recordedMinusPlanned: recordedSets - plannedSets,
      remainingSets: Math.max(0, plannedSets - recordedSets),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plannedSets: 4, recordedSets: 3 },
  output: { recordedMinusPlanned: -1, remainingSets: 1 },
} satisfies ToolExample<Input, Output>;
export const exerciseLogSetCountDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["physiotherapy", "health and medicine"],
      keywords: ["physiotherapy", "health and medicine"],
    },
    id: "physiotherapy/exercise-log-set-count-delta",
    title: "Exercise Log Set Count Delta",
    description:
      "Compare explicit planned and recorded exercise set counts without prescribing exercise volume.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedSets: { type: "integer", minimum: 0 },
        recordedSets: { type: "integer", minimum: 0 },
      },
      required: ["plannedSets", "recordedSets"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedMinusPlanned: { type: "integer" },
        remainingSets: { type: "integer" },
      },
      required: ["recordedMinusPlanned", "remainingSets"],
    },
    ports: {
      inputs: [
        {
          id: "plannedSets",
          label: "Planned Sets",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recordedSets",
          label: "Recorded Sets",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "recordedMinusPlanned",
          label: "Recorded Minus Planned",
          valueType: { type: "integer" },
        },
        {
          id: "remainingSets",
          label: "Remaining Sets",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = exerciseLogSetCountDeltaTool.execute;
export default exerciseLogSetCountDeltaTool;
