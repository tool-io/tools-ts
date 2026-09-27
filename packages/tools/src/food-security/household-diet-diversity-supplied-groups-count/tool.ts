import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: readonly string[];
  readonly allowedGroups: readonly string[];
};
export type Output = {
  readonly uniqueGroups: readonly string[];
  readonly count: number;
  readonly unknownGroups: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    allowedGroups: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["observed", "allowedGroups"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueGroups: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    count: { type: "integer" },
    unknownGroups: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["uniqueGroups", "count", "unknownGroups"],
} as const;
/** Count caller-defined distinct groups; no diet score or nutritional adequacy threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, allowedGroups } = request;
  const compute = (): Output => {
    H.domain(new Set(allowedGroups).size === allowedGroups.length);
    const unique = [...new Set(observed)];
    const uniqueGroups = unique.filter((x) => allowedGroups.includes(x)),
      unknownGroups = unique.filter((x) => !allowedGroups.includes(x));
    return { uniqueGroups, count: uniqueGroups.length, unknownGroups };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observed: ["grain", "fruit", "grain", "other"],
    allowedGroups: ["grain", "fruit", "veg"],
  },
  output: {
    uniqueGroups: ["grain", "fruit"],
    count: 2,
    unknownGroups: ["other"],
  },
} satisfies ToolExample<Input, Output>;
export const householdDietDiversitySuppliedGroupsCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-security/household-diet-diversity-supplied-groups-count",
      title: "Household Diet Diversity Supplied Groups Count Tool",
      description:
        "Count caller-defined distinct groups; no diet score or nutritional adequacy threshold.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observed: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          allowedGroups: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["observed", "allowedGroups"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          uniqueGroups: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          count: { type: "integer" },
          unknownGroups: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["uniqueGroups", "count", "unknownGroups"],
      },
      ports: {
        inputs: [
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "allowedGroups",
            label: "Allowed Groups",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "uniqueGroups",
            label: "Unique Groups",
            valueType: { type: "list", items: { type: "string" } },
          },
          { id: "count", label: "Count", valueType: { type: "integer" } },
          {
            id: "unknownGroups",
            label: "Unknown Groups",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = householdDietDiversitySuppliedGroupsCountTool.execute;
export default householdDietDiversitySuppliedGroupsCountTool;
