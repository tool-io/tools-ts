import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly panels: number;
  readonly hours: number;
  readonly missingPanelHours: number;
  readonly excludedPanelHours: number;
  readonly sharedMissingExcluded: number;
};
export type Output = {
  readonly grossEffort: number;
  readonly usableEffort: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    panels: { type: "integer", minimum: 0 },
    hours: { type: "number", minimum: 0 },
    missingPanelHours: { type: "number", minimum: 0 },
    excludedPanelHours: { type: "number", minimum: 0 },
    sharedMissingExcluded: { type: "number", minimum: 0 },
  },
  required: [
    "panels",
    "hours",
    "missingPanelHours",
    "excludedPanelHours",
    "sharedMissingExcluded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossEffort: { type: "number" },
    usableEffort: { type: "number" },
  },
  required: ["grossEffort", "usableEffort"],
} as const;
/** Calculate net effort missing panel budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    panels,
    hours,
    missingPanelHours,
    excludedPanelHours,
    sharedMissingExcluded,
  } = request;
  const compute = (): Output => {
    H.integer(panels, 0);
    H.domain(
      hours >= 0 &&
        missingPanelHours >= 0 &&
        excludedPanelHours >= 0 &&
        sharedMissingExcluded >= 0 &&
        sharedMissingExcluded <=
          Math.min(missingPanelHours, excludedPanelHours) &&
        missingPanelHours + excludedPanelHours - sharedMissingExcluded <=
          panels * hours,
    );
    return {
      grossEffort: panels * hours,
      usableEffort:
        panels * hours -
        missingPanelHours -
        excludedPanelHours +
        sharedMissingExcluded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    panels: 4,
    hours: 10,
    missingPanelHours: 5,
    excludedPanelHours: 3,
    sharedMissingExcluded: 1,
  },
  output: { grossEffort: 40, usableEffort: 33 },
} satisfies ToolExample<Input, Output>;
export const netEffortMissingPanelBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/net-effort-missing-panel-budget",
    title: "Net Effort Missing Panel Budget Tool",
    description:
      "Calculate net effort missing panel budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        panels: { type: "integer", minimum: 0 },
        hours: { type: "number", minimum: 0 },
        missingPanelHours: { type: "number", minimum: 0 },
        excludedPanelHours: { type: "number", minimum: 0 },
        sharedMissingExcluded: { type: "number", minimum: 0 },
      },
      required: [
        "panels",
        "hours",
        "missingPanelHours",
        "excludedPanelHours",
        "sharedMissingExcluded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossEffort: { type: "number" },
        usableEffort: { type: "number" },
      },
      required: ["grossEffort", "usableEffort"],
    },
    ports: {
      inputs: [
        {
          id: "panels",
          label: "Panels",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "hours",
          label: "Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "missingPanelHours",
          label: "Missing Panel Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedPanelHours",
          label: "Excluded Panel Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedMissingExcluded",
          label: "Shared Missing Excluded",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossEffort",
          label: "Gross Effort",
          valueType: { type: "number" },
        },
        {
          id: "usableEffort",
          label: "Usable Effort",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = netEffortMissingPanelBudgetTool.execute;
export default netEffortMissingPanelBudgetTool;
