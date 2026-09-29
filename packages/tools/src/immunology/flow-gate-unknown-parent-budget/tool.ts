import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedEvents: number;
  readonly knownParentEvents: number;
  readonly unknownParentEvents: number;
  readonly excludedUnknown: number;
};
export type Output = {
  readonly eligibleKnown: number;
  readonly unresolved: number;
  readonly unassigned: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedEvents: { type: "integer", minimum: 0 },
    knownParentEvents: { type: "integer", minimum: 0 },
    unknownParentEvents: { type: "integer", minimum: 0 },
    excludedUnknown: { type: "integer", minimum: 0 },
  },
  required: [
    "recordedEvents",
    "knownParentEvents",
    "unknownParentEvents",
    "excludedUnknown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleKnown: { type: "integer" },
    unresolved: { type: "integer" },
    unassigned: { type: "integer" },
  },
  required: ["eligibleKnown", "unresolved", "unassigned"],
} as const;
/** Audit supplied parent-gate metadata counts without gating a cytometry file or identifying immune populations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    recordedEvents,
    knownParentEvents,
    unknownParentEvents,
    excludedUnknown,
  } = request;
  const compute = (): Output => {
    H.integer(recordedEvents, 0);
    H.integer(knownParentEvents, 0);
    H.integer(unknownParentEvents, 0);
    H.integer(excludedUnknown, 0, unknownParentEvents);
    H.domain(knownParentEvents + unknownParentEvents <= recordedEvents);
    return {
      eligibleKnown: knownParentEvents,
      unresolved: unknownParentEvents - excludedUnknown,
      unassigned: recordedEvents - knownParentEvents - unknownParentEvents,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedEvents: 100,
    knownParentEvents: 70,
    unknownParentEvents: 20,
    excludedUnknown: 5,
  },
  output: { eligibleKnown: 70, unresolved: 15, unassigned: 10 },
} satisfies ToolExample<Input, Output>;
export const flowGateUnknownParentBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/flow-gate-unknown-parent-budget",
    title: "Flow Gate Unknown Parent Budget Tool",
    description:
      "Audit supplied parent-gate metadata counts without gating a cytometry file or identifying immune populations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedEvents: { type: "integer", minimum: 0 },
        knownParentEvents: { type: "integer", minimum: 0 },
        unknownParentEvents: { type: "integer", minimum: 0 },
        excludedUnknown: { type: "integer", minimum: 0 },
      },
      required: [
        "recordedEvents",
        "knownParentEvents",
        "unknownParentEvents",
        "excludedUnknown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleKnown: { type: "integer" },
        unresolved: { type: "integer" },
        unassigned: { type: "integer" },
      },
      required: ["eligibleKnown", "unresolved", "unassigned"],
    },
    ports: {
      inputs: [
        {
          id: "recordedEvents",
          label: "Recorded Events",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "knownParentEvents",
          label: "Known Parent Events",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unknownParentEvents",
          label: "Unknown Parent Events",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedUnknown",
          label: "Excluded Unknown",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "eligibleKnown",
          label: "Eligible Known",
          valueType: { type: "integer" },
        },
        {
          id: "unresolved",
          label: "Unresolved",
          valueType: { type: "integer" },
        },
        {
          id: "unassigned",
          label: "Unassigned",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = flowGateUnknownParentBudgetTool.execute;
export default flowGateUnknownParentBudgetTool;
