import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expertAssignments: number;
  readonly totalAssignments: number;
  readonly totalTokens: number;
  readonly capacity: number;
};
export type Output = {
  readonly loadShare: number;
  readonly assignmentsPerToken: number;
  readonly overflow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expertAssignments: { type: "integer", minimum: 0 },
    totalAssignments: { type: "integer", minimum: 1 },
    totalTokens: { type: "integer", minimum: 1 },
    capacity: { type: "integer", minimum: 0 },
  },
  required: [
    "expertAssignments",
    "totalAssignments",
    "totalTokens",
    "capacity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loadShare: { type: "number" },
    assignmentsPerToken: { type: "number" },
    overflow: { type: "integer" },
  },
  required: ["loadShare", "assignmentsPerToken", "overflow"],
} as const;
/** Calculate mixture router load one expert term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expertAssignments, totalAssignments, totalTokens, capacity } =
    request;
  const compute = (): Output => {
    H.integer(totalAssignments, 1);
    H.integer(expertAssignments, 0, totalAssignments);
    H.integer(totalTokens, 1);
    H.integer(capacity, 0);
    return {
      loadShare: expertAssignments / totalAssignments,
      assignmentsPerToken: expertAssignments / totalTokens,
      overflow: Math.max(0, expertAssignments - capacity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    expertAssignments: 40,
    totalAssignments: 100,
    totalTokens: 50,
    capacity: 30,
  },
  output: { loadShare: 0.4, assignmentsPerToken: 0.8, overflow: 10 },
} satisfies ToolExample<Input, Output>;
export const mixtureRouterLoadOneExpertTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/mixture-router-load-one-expert-term",
    title: "Mixture Router Load One Expert Term Tool",
    description:
      "Calculate mixture router load one expert term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expertAssignments: { type: "integer", minimum: 0 },
        totalAssignments: { type: "integer", minimum: 1 },
        totalTokens: { type: "integer", minimum: 1 },
        capacity: { type: "integer", minimum: 0 },
      },
      required: [
        "expertAssignments",
        "totalAssignments",
        "totalTokens",
        "capacity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loadShare: { type: "number" },
        assignmentsPerToken: { type: "number" },
        overflow: { type: "integer" },
      },
      required: ["loadShare", "assignmentsPerToken", "overflow"],
    },
    ports: {
      inputs: [
        {
          id: "expertAssignments",
          label: "Expert Assignments",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalAssignments",
          label: "Total Assignments",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalTokens",
          label: "Total Tokens",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "loadShare", label: "Load Share", valueType: { type: "number" } },
        {
          id: "assignmentsPerToken",
          label: "Assignments Per Token",
          valueType: { type: "number" },
        },
        { id: "overflow", label: "Overflow", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = mixtureRouterLoadOneExpertTermTool.execute;
export default mixtureRouterLoadOneExpertTermTool;
