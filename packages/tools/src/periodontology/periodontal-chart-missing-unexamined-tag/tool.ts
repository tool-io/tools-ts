import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly toothIds: readonly string[];
  readonly statuses: readonly string[];
};
export type Output = {
  readonly examined: readonly string[];
  readonly unexamined: readonly string[];
  readonly missing: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    toothIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    statuses: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["toothIds", "statuses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    examined: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    unexamined: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missing: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["examined", "unexamined", "missing"],
} as const;
/** Partition supplied tooth IDs by explicit examination status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { toothIds, statuses } = request;
  const compute = (): Output => {
    H.sameLength(toothIds, statuses);
    H.domain(
      new Set(toothIds).size === toothIds.length &&
        statuses.every((x) =>
          ["examined", "unexamined", "missing"].includes(x),
        ),
      "statuses",
    );
    return {
      examined: toothIds.filter((_, i) => statuses[i] === "examined"),
      unexamined: toothIds.filter((_, i) => statuses[i] === "unexamined"),
      missing: toothIds.filter((_, i) => statuses[i] === "missing"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    toothIds: ["11", "12", "13"],
    statuses: ["examined", "missing", "unexamined"],
  },
  output: { examined: ["11"], unexamined: ["13"], missing: ["12"] },
} satisfies ToolExample<Input, Output>;
export const periodontalChartMissingUnexaminedTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "periodontology/periodontal-chart-missing-unexamined-tag",
      title: "Periodontal Chart Missing Unexamined Tag Tool",
      description:
        "Partition supplied tooth IDs by explicit examination status.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          toothIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          statuses: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["toothIds", "statuses"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          examined: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          unexamined: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          missing: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["examined", "unexamined", "missing"],
      },
      ports: {
        inputs: [
          {
            id: "toothIds",
            label: "Tooth Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "statuses",
            label: "Statuses",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "examined",
            label: "Examined",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "unexamined",
            label: "Unexamined",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "missing",
            label: "Missing",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = periodontalChartMissingUnexaminedTagTool.execute;
export default periodontalChartMissingUnexaminedTagTool;
