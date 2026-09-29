import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentCount: number;
  readonly childCount: number;
  readonly totalEvents: number;
};
export type Output = {
  readonly parentFraction: number;
  readonly childOfParent: number;
  readonly childOfTotal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentCount: { type: "integer", minimum: 1 },
    childCount: { type: "integer", minimum: 0 },
    totalEvents: { type: "integer", minimum: 1 },
  },
  required: ["parentCount", "childCount", "totalEvents"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentFraction: { type: "number" },
    childOfParent: { type: "number" },
    childOfTotal: { type: "number" },
  },
  required: ["parentFraction", "childOfParent", "childOfTotal"],
} as const;
/** Nested gating denominator arithmetic from caller-supplied event counts, without cell classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentCount, childCount, totalEvents } = request;
  const compute = (): Output => {
    H.integer(totalEvents, 1);
    H.integer(parentCount, 1, totalEvents);
    H.integer(childCount, 0, parentCount);
    return {
      parentFraction: parentCount / totalEvents,
      childOfParent: childCount / parentCount,
      childOfTotal: childCount / totalEvents,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parentCount: 200, childCount: 50, totalEvents: 1000 },
  output: { parentFraction: 0.2, childOfParent: 0.25, childOfTotal: 0.05 },
} satisfies ToolExample<Input, Output>;
export const flowCytometryParentChildFrequencyTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "immunology/flow-cytometry-parent-child-frequency-term",
      title: "Flow Cytometry Parent Child Frequency Term Tool",
      description:
        "Nested gating denominator arithmetic from caller-supplied event counts, without cell classification.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parentCount: { type: "integer", minimum: 1 },
          childCount: { type: "integer", minimum: 0 },
          totalEvents: { type: "integer", minimum: 1 },
        },
        required: ["parentCount", "childCount", "totalEvents"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parentFraction: { type: "number" },
          childOfParent: { type: "number" },
          childOfTotal: { type: "number" },
        },
        required: ["parentFraction", "childOfParent", "childOfTotal"],
      },
      ports: {
        inputs: [
          {
            id: "parentCount",
            label: "Parent Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "childCount",
            label: "Child Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "totalEvents",
            label: "Total Events",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "parentFraction",
            label: "Parent Fraction",
            valueType: { type: "number" },
          },
          {
            id: "childOfParent",
            label: "Child Of Parent",
            valueType: { type: "number" },
          },
          {
            id: "childOfTotal",
            label: "Child Of Total",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = flowCytometryParentChildFrequencyTermTool.execute;
export default flowCytometryParentChildFrequencyTermTool;
