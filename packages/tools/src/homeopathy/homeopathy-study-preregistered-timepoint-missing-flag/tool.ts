import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedDays: readonly number[];
  readonly observedDays: readonly number[];
  readonly toleranceDays: number;
};
export type Output = {
  readonly missingPlanned: readonly number[];
  readonly unexpectedObserved: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedDays: { type: "array", maxItems: 256, items: { type: "integer" } },
    observedDays: { type: "array", maxItems: 256, items: { type: "integer" } },
    toleranceDays: { type: "integer", minimum: 0 },
  },
  required: ["plannedDays", "observedDays", "toleranceDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingPlanned: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    unexpectedObserved: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["missingPlanned", "unexpectedObserved"],
} as const;
/** Match explicit registered and observed timepoints under a supplied timing tolerance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedDays, observedDays, toleranceDays } = request;
  const compute = (): Output => {
    H.integer(toleranceDays, 0);
    H.domain(new Set(plannedDays).size === plannedDays.length);
    return {
      missingPlanned: plannedDays.filter(
        (x) => !observedDays.some((y) => Math.abs(x - y) <= toleranceDays),
      ),
      unexpectedObserved: observedDays.filter(
        (x) => !plannedDays.some((y) => Math.abs(x - y) <= toleranceDays),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    plannedDays: [7, 14, 28],
    observedDays: [8, 28, 60],
    toleranceDays: 1,
  },
  output: { missingPlanned: [14], unexpectedObserved: [60] },
} satisfies ToolExample<Input, Output>;
export const homeopathyStudyPreregisteredTimepointMissingFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "homeopathy/homeopathy-study-preregistered-timepoint-missing-flag",
      title: "Homeopathy Study Preregistered Timepoint Missing Flag Tool",
      description:
        "Match explicit registered and observed timepoints under a supplied timing tolerance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          plannedDays: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          observedDays: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          toleranceDays: { type: "integer", minimum: 0 },
        },
        required: ["plannedDays", "observedDays", "toleranceDays"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          missingPlanned: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          unexpectedObserved: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["missingPlanned", "unexpectedObserved"],
      },
      ports: {
        inputs: [
          {
            id: "plannedDays",
            label: "Planned Days",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "observedDays",
            label: "Observed Days",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "toleranceDays",
            label: "Tolerance Days",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "missingPlanned",
            label: "Missing Planned",
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "unexpectedObserved",
            label: "Unexpected Observed",
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = homeopathyStudyPreregisteredTimepointMissingFlagTool.execute;
export default homeopathyStudyPreregisteredTimepointMissingFlagTool;
