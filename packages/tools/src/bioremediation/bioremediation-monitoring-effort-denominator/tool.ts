import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observations: number;
  readonly plannedHours: number;
  readonly missingHours: number;
  readonly excludedHours: number;
};
export type Output = { readonly eligibleHours: number; readonly rate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observations: { type: "integer", minimum: 0 },
    plannedHours: { type: "number" },
    missingHours: { type: "number", minimum: 0 },
    excludedHours: { type: "number", minimum: 0 },
  },
  required: ["observations", "plannedHours", "missingHours", "excludedHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eligibleHours: { type: "number" }, rate: { type: "number" } },
  required: ["eligibleHours", "rate"],
} as const;
/** Calculate bioremediation monitoring effort denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observations, plannedHours, missingHours, excludedHours } = request;
  const compute = (): Output => {
    H.integer(observations, 0);
    H.domain(
      missingHours >= 0 &&
        excludedHours >= 0 &&
        plannedHours > missingHours + excludedHours,
    );
    return {
      eligibleHours: plannedHours - missingHours - excludedHours,
      rate: observations / (plannedHours - missingHours - excludedHours),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observations: 30,
    plannedHours: 12,
    missingHours: 2,
    excludedHours: 1,
  },
  output: { eligibleHours: 9, rate: 3.3333333333333335 },
} satisfies ToolExample<Input, Output>;
export const bioremediationMonitoringEffortDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioremediation/bioremediation-monitoring-effort-denominator",
      title: "Bioremediation Monitoring Effort Denominator Tool",
      description:
        "Calculate bioremediation monitoring effort denominator from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observations: { type: "integer", minimum: 0 },
          plannedHours: { type: "number" },
          missingHours: { type: "number", minimum: 0 },
          excludedHours: { type: "number", minimum: 0 },
        },
        required: [
          "observations",
          "plannedHours",
          "missingHours",
          "excludedHours",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligibleHours: { type: "number" },
          rate: { type: "number" },
        },
        required: ["eligibleHours", "rate"],
      },
      ports: {
        inputs: [
          {
            id: "observations",
            label: "Observations",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "plannedHours",
            label: "Planned Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "missingHours",
            label: "Missing Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "excludedHours",
            label: "Excluded Hours",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "eligibleHours",
            label: "Eligible Hours",
            valueType: { type: "number" },
          },
          { id: "rate", label: "Rate", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = bioremediationMonitoringEffortDenominatorTool.execute;
export default bioremediationMonitoringEffortDenominatorTool;
