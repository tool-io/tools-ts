import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly statuses: readonly string[];
  readonly reopenedToken: string;
  readonly closedToken: string;
};
export type Output = {
  readonly reopenCount: number;
  readonly closureCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    statuses: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    reopenedToken: { type: "string", maxLength: 8192 },
    closedToken: { type: "string", maxLength: 8192 },
  },
  required: ["statuses", "reopenedToken", "closedToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reopenCount: { type: "integer" },
    closureCount: { type: "integer" },
  },
  required: ["reopenCount", "closureCount"],
} as const;
/** Count caller-supplied query lifecycle marker occurrences without reconstructing missing status changes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { statuses, reopenedToken, closedToken } = request;
  const compute = (): Output => {
    H.domain(reopenedToken !== closedToken);
    return {
      reopenCount: statuses.filter((x) => x === reopenedToken).length,
      closureCount: statuses.filter((x) => x === closedToken).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    statuses: ["open", "closed", "reopened", "closed"],
    reopenedToken: "reopened",
    closedToken: "closed",
  },
  output: { reopenCount: 1, closureCount: 2 },
} satisfies ToolExample<Input, Output>;
export const queryStatusCycleIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-research/query-status-cycle-index",
    title: "Query Status Cycle Index Tool",
    description:
      "Count caller-supplied query lifecycle marker occurrences without reconstructing missing status changes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        statuses: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        reopenedToken: { type: "string", maxLength: 8192 },
        closedToken: { type: "string", maxLength: 8192 },
      },
      required: ["statuses", "reopenedToken", "closedToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reopenCount: { type: "integer" },
        closureCount: { type: "integer" },
      },
      required: ["reopenCount", "closureCount"],
    },
    ports: {
      inputs: [
        {
          id: "statuses",
          label: "Statuses",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "reopenedToken",
          label: "Reopened Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "closedToken",
          label: "Closed Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "reopenCount",
          label: "Reopen Count",
          valueType: { type: "integer" },
        },
        {
          id: "closureCount",
          label: "Closure Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = queryStatusCycleIndexTool.execute;
export default queryStatusCycleIndexTool;
