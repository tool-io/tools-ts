import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outgroupTipIds: readonly string[];
  readonly firstSideTipIds: readonly string[];
  readonly secondSideTipIds: readonly string[];
};
export type Output = {
  readonly allOnFirst: boolean;
  readonly allOnSecond: boolean;
  readonly splitAcrossSides: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outgroupTipIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    firstSideTipIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    secondSideTipIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["outgroupTipIds", "firstSideTipIds", "secondSideTipIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allOnFirst: { type: "boolean" },
    allOnSecond: { type: "boolean" },
    splitAcrossSides: { type: "boolean" },
  },
  required: ["allOnFirst", "allOnSecond", "splitAcrossSides"],
} as const;
/** Locate explicitly identified outgroup tips across two supplied disjoint tree sides without rerooting or inferring an outgroup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outgroupTipIds, firstSideTipIds, secondSideTipIds } = request;
  const compute = (): Output => {
    H.domain(
      outgroupTipIds.length > 0 &&
        new Set(outgroupTipIds).size === outgroupTipIds.length,
      "outgroupTipIds",
    );
    H.domain(
      !firstSideTipIds.some((x) => secondSideTipIds.includes(x)),
      "secondSideTipIds",
    );
    H.domain(
      outgroupTipIds.every(
        (x) => firstSideTipIds.includes(x) || secondSideTipIds.includes(x),
      ),
      "outgroupTipIds",
    );
    return (() => {
      const allOnFirst = outgroupTipIds.every((x) =>
          firstSideTipIds.includes(x),
        ),
        allOnSecond = outgroupTipIds.every((x) => secondSideTipIds.includes(x));
      return {
        allOnFirst,
        allOnSecond,
        splitAcrossSides: !allOnFirst && !allOnSecond,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    outgroupTipIds: ["A", "B"],
    firstSideTipIds: ["A", "B", "C"],
    secondSideTipIds: ["D"],
  },
  output: { allOnFirst: true, allOnSecond: false, splitAcrossSides: false },
} satisfies ToolExample<Input, Output>;
export const outGroupRootSideFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["evolutionary-biology", "evolutionary biology", "biology"],
      keywords: ["evolutionary biology", "biology"],
    },
    id: "evolutionary-biology/out-group-root-side-flag",
    title: "Out Group Root Side Flag",
    description:
      "Locate explicitly identified outgroup tips across two supplied disjoint tree sides without rerooting or inferring an outgroup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outgroupTipIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        firstSideTipIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        secondSideTipIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["outgroupTipIds", "firstSideTipIds", "secondSideTipIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allOnFirst: { type: "boolean" },
        allOnSecond: { type: "boolean" },
        splitAcrossSides: { type: "boolean" },
      },
      required: ["allOnFirst", "allOnSecond", "splitAcrossSides"],
    },
    ports: {
      inputs: [
        {
          id: "outgroupTipIds",
          label: "Outgroup Tip Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "firstSideTipIds",
          label: "First Side Tip Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "secondSideTipIds",
          label: "Second Side Tip Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "allOnFirst",
          label: "All On First",
          valueType: { type: "boolean" },
        },
        {
          id: "allOnSecond",
          label: "All On Second",
          valueType: { type: "boolean" },
        },
        {
          id: "splitAcrossSides",
          label: "Split Across Sides",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = outGroupRootSideFlagTool.execute;
export default outGroupRootSideFlagTool;
