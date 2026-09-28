import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly countryIds: readonly string[];
  readonly regionAssignments: readonly string[];
  readonly unassignedToken: string;
};
export type Output = {
  readonly unassignedIds: readonly string[];
  readonly assignedCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countryIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    regionAssignments: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    unassignedToken: { type: "string", maxLength: 8192 },
  },
  required: ["countryIds", "regionAssignments", "unassignedToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unassignedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    assignedCount: { type: "integer" },
  },
  required: ["unassignedIds", "assignedCount"],
} as const;
/** Audit explicit country-to-region assignments without choosing a world-region classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { countryIds, regionAssignments, unassignedToken } = request;
  const compute = (): Output => {
    H.domain(
      countryIds.length === regionAssignments.length &&
        new Set(countryIds).size === countryIds.length,
    );
    return {
      unassignedIds: countryIds.filter(
        (_, i) => regionAssignments[i] === unassignedToken,
      ),
      assignedCount: regionAssignments.filter((x) => x !== unassignedToken)
        .length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    countryIds: ["A", "B", "C"],
    regionAssignments: ["R1", "?", "R2"],
    unassignedToken: "?",
  },
  output: { unassignedIds: ["B"], assignedCount: 2 },
} satisfies ToolExample<Input, Output>;
export const worldRegionUnassignedCountryCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/world-region-unassigned-country-count",
    title: "World Region Unassigned Country Count Tool",
    description:
      "Audit explicit country-to-region assignments without choosing a world-region classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countryIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        regionAssignments: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        unassignedToken: { type: "string", maxLength: 8192 },
      },
      required: ["countryIds", "regionAssignments", "unassignedToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unassignedIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        assignedCount: { type: "integer" },
      },
      required: ["unassignedIds", "assignedCount"],
    },
    ports: {
      inputs: [
        {
          id: "countryIds",
          label: "Country Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "regionAssignments",
          label: "Region Assignments",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "unassignedToken",
          label: "Unassigned Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "unassignedIds",
          label: "Unassigned Ids",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "assignedCount",
          label: "Assigned Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = worldRegionUnassignedCountryCountTool.execute;
export default worldRegionUnassignedCountryCountTool;
