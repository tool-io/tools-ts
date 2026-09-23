import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issued: number;
  readonly returned: number;
  readonly reportedLost: number;
  readonly invalidated: number;
};
export type Output = {
  readonly unreturned: number;
  readonly unaccounted: number;
  readonly minimumInvalidatedUnreturned: number;
  readonly maximumInvalidatedUnreturned: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issued: { type: "integer", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
    reportedLost: { type: "integer", minimum: 0 },
    invalidated: { type: "integer", minimum: 0 },
  },
  required: ["issued", "returned", "reportedLost", "invalidated"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unreturned: { type: "integer" },
    unaccounted: { type: "integer" },
    minimumInvalidatedUnreturned: { type: "integer" },
    maximumInvalidatedUnreturned: { type: "integer" },
  },
  required: [
    "unreturned",
    "unaccounted",
    "minimumInvalidatedUnreturned",
    "maximumInvalidatedUnreturned",
  ],
} as const;
/** Reconcile badge counts and return sharp lower/upper bounds on invalidated unreturned badges when only aggregate counts are supplied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issued, returned, reportedLost, invalidated } = request;
  const compute = (): Output => {
    H.integer(issued, 0);
    H.integer(returned, 0, issued);
    H.integer(reportedLost, 0, issued - returned);
    H.integer(invalidated, 0, issued);
    return {
      unreturned: issued - returned,
      unaccounted: issued - returned - reportedLost,
      minimumInvalidatedUnreturned: Math.max(0, invalidated - returned),
      maximumInvalidatedUnreturned: Math.min(invalidated, issued - returned),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issued: 100, returned: 90, reportedLost: 3, invalidated: 5 },
  output: {
    unreturned: 10,
    unaccounted: 7,
    minimumInvalidatedUnreturned: 0,
    maximumInvalidatedUnreturned: 5,
  },
} satisfies ToolExample<Input, Output>;
export const biosecurityVisitorReturnedBadgeBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosecurity/biosecurity-visitor-returned-badge-balance",
      title: "Biosecurity Visitor Returned Badge Balance Tool",
      description:
        "Reconcile badge counts and return sharp lower/upper bounds on invalidated unreturned badges when only aggregate counts are supplied.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          issued: { type: "integer", minimum: 0 },
          returned: { type: "integer", minimum: 0 },
          reportedLost: { type: "integer", minimum: 0 },
          invalidated: { type: "integer", minimum: 0 },
        },
        required: ["issued", "returned", "reportedLost", "invalidated"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unreturned: { type: "integer" },
          unaccounted: { type: "integer" },
          minimumInvalidatedUnreturned: { type: "integer" },
          maximumInvalidatedUnreturned: { type: "integer" },
        },
        required: [
          "unreturned",
          "unaccounted",
          "minimumInvalidatedUnreturned",
          "maximumInvalidatedUnreturned",
        ],
      },
      ports: {
        inputs: [
          {
            id: "issued",
            label: "Issued",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "returned",
            label: "Returned",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reportedLost",
            label: "Reported Lost",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "invalidated",
            label: "Invalidated",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "unreturned",
            label: "Unreturned",
            valueType: { type: "integer" },
          },
          {
            id: "unaccounted",
            label: "Unaccounted",
            valueType: { type: "integer" },
          },
          {
            id: "minimumInvalidatedUnreturned",
            label: "Minimum Invalidated Unreturned",
            valueType: { type: "integer" },
          },
          {
            id: "maximumInvalidatedUnreturned",
            label: "Maximum Invalidated Unreturned",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosecurityVisitorReturnedBadgeBalanceTool.execute;
export default biosecurityVisitorReturnedBadgeBalanceTool;
