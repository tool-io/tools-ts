import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly childEvents: number;
  readonly parentEvents: number;
  readonly excludedParentEvents: number;
  readonly excludedChildEvents: number;
};
export type Output = {
  readonly eligibleParent: number;
  readonly eligibleChild: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    childEvents: { type: "integer", minimum: 0 },
    parentEvents: { type: "integer", minimum: 0 },
    excludedParentEvents: { type: "integer", minimum: 0 },
    excludedChildEvents: { type: "integer", minimum: 0 },
  },
  required: [
    "childEvents",
    "parentEvents",
    "excludedParentEvents",
    "excludedChildEvents",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleParent: { type: "integer" },
    eligibleChild: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["eligibleParent", "eligibleChild", "share", "defined"],
} as const;
/** Audit supplied parent/child gate counts and exclusion overlap without gating data or identifying cell populations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    childEvents,
    parentEvents,
    excludedParentEvents,
    excludedChildEvents,
  } = request;
  const compute = (): Output => {
    H.integer(parentEvents, 0);
    H.integer(childEvents, 0, parentEvents);
    H.integer(excludedParentEvents, 0, parentEvents);
    H.integer(
      excludedChildEvents,
      0,
      Math.min(childEvents, excludedParentEvents),
    );
    H.domain(
      childEvents - excludedChildEvents <= parentEvents - excludedParentEvents,
    );
    return {
      eligibleParent: parentEvents - excludedParentEvents,
      eligibleChild: childEvents - excludedChildEvents,
      share:
        parentEvents > excludedParentEvents
          ? (childEvents - excludedChildEvents) /
            (parentEvents - excludedParentEvents)
          : 0,
      defined: parentEvents > excludedParentEvents,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    childEvents: 40,
    parentEvents: 100,
    excludedParentEvents: 20,
    excludedChildEvents: 10,
  },
  output: {
    eligibleParent: 80,
    eligibleChild: 30,
    share: 0.375,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const gatedCellDenominatorShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/gated-cell-denominator-share",
    title: "Gated Cell Denominator Share Tool",
    description:
      "Audit supplied parent/child gate counts and exclusion overlap without gating data or identifying cell populations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        childEvents: { type: "integer", minimum: 0 },
        parentEvents: { type: "integer", minimum: 0 },
        excludedParentEvents: { type: "integer", minimum: 0 },
        excludedChildEvents: { type: "integer", minimum: 0 },
      },
      required: [
        "childEvents",
        "parentEvents",
        "excludedParentEvents",
        "excludedChildEvents",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleParent: { type: "integer" },
        eligibleChild: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["eligibleParent", "eligibleChild", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "childEvents",
          label: "Child Events",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "parentEvents",
          label: "Parent Events",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedParentEvents",
          label: "Excluded Parent Events",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedChildEvents",
          label: "Excluded Child Events",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "eligibleParent",
          label: "Eligible Parent",
          valueType: { type: "integer" },
        },
        {
          id: "eligibleChild",
          label: "Eligible Child",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = gatedCellDenominatorShareTool.execute;
export default gatedCellDenominatorShareTool;
