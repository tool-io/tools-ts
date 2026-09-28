import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assignedCounts: readonly number[];
  readonly total: number;
  readonly duplicateAssignments: number;
};
export type Output = {
  readonly assignedUnique: number;
  readonly unassigned: number;
  readonly unassignedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assignedCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    total: { type: "integer", minimum: 1 },
    duplicateAssignments: { type: "integer", minimum: 0 },
  },
  required: ["assignedCounts", "total", "duplicateAssignments"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assignedUnique: { type: "integer" },
    unassigned: { type: "integer" },
    unassignedShare: { type: "number" },
  },
  required: ["assignedUnique", "unassigned", "unassignedShare"],
} as const;
/** Calculate world region unassigned share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assignedCounts, total, duplicateAssignments } = request;
  const compute = (): Output => {
    H.integer(total, 1);
    H.integer(duplicateAssignments, 0);
    H.domain(
      assignedCounts.every((x) => x >= 0) &&
        duplicateAssignments <= assignedCounts.reduce((a, b) => a + b, 0) &&
        assignedCounts.reduce((a, b) => a + b, 0) - duplicateAssignments <=
          total,
    );
    return {
      assignedUnique:
        assignedCounts.reduce((a, b) => a + b, 0) - duplicateAssignments,
      unassigned:
        total -
        assignedCounts.reduce((a, b) => a + b, 0) +
        duplicateAssignments,
      unassignedShare:
        (total -
          assignedCounts.reduce((a, b) => a + b, 0) +
          duplicateAssignments) /
        total,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assignedCounts: [30, 40], total: 100, duplicateAssignments: 5 },
  output: { assignedUnique: 65, unassigned: 35, unassignedShare: 0.35 },
} satisfies ToolExample<Input, Output>;
export const worldRegionUnassignedShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/world-region-unassigned-share",
    title: "World Region Unassigned Share Tool",
    description:
      "Calculate world region unassigned share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assignedCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        total: { type: "integer", minimum: 1 },
        duplicateAssignments: { type: "integer", minimum: 0 },
      },
      required: ["assignedCounts", "total", "duplicateAssignments"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assignedUnique: { type: "integer" },
        unassigned: { type: "integer" },
        unassignedShare: { type: "number" },
      },
      required: ["assignedUnique", "unassigned", "unassignedShare"],
    },
    ports: {
      inputs: [
        {
          id: "assignedCounts",
          label: "Assigned Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "total",
          label: "Total",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "duplicateAssignments",
          label: "Duplicate Assignments",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "assignedUnique",
          label: "Assigned Unique",
          valueType: { type: "integer" },
        },
        {
          id: "unassigned",
          label: "Unassigned",
          valueType: { type: "integer" },
        },
        {
          id: "unassignedShare",
          label: "Unassigned Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = worldRegionUnassignedShareTool.execute;
export default worldRegionUnassignedShareTool;
