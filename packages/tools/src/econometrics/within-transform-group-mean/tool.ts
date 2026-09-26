import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly values: readonly number[];
  readonly groups: readonly string[];
};
export type Output = {
  readonly groupMeans: readonly number[];
  readonly centered: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: { type: "array", maxItems: 256, items: { type: "number" } },
    groups: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["values", "groups"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupMeans: { type: "array", maxItems: 256, items: { type: "number" } },
    centered: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["groupMeans", "centered"],
} as const;
/** Subtract supplied observations’ group means without estimating a fixed-effects model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { values, groups } = request;
  const compute = (): Output => {
    H.sameLength(values, groups);
    const sums = new Map<string, number>(),
      counts = new Map<string, number>();
    values.forEach((x, i) => {
      sums.set(groups[i], (sums.get(groups[i]) ?? 0) + x);
      counts.set(groups[i], (counts.get(groups[i]) ?? 0) + 1);
    });
    const groupMeans = groups.map(
      (g) => (sums.get(g) ?? 0) / (counts.get(g) ?? 1),
    );
    return { groupMeans, centered: values.map((x, i) => x - groupMeans[i]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { values: [2, 4, 10], groups: ["A", "A", "B"] },
  output: { groupMeans: [3, 3, 10], centered: [-1, 1, 0] },
} satisfies ToolExample<Input, Output>;
export const withinTransformGroupMeanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/within-transform-group-mean",
    title: "Within Transform Group Mean Tool",
    description:
      "Subtract supplied observations’ group means without estimating a fixed-effects model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: { type: "array", maxItems: 256, items: { type: "number" } },
        groups: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["values", "groups"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groupMeans: { type: "array", maxItems: 256, items: { type: "number" } },
        centered: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["groupMeans", "centered"],
    },
    ports: {
      inputs: [
        {
          id: "values",
          label: "Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "groups",
          label: "Groups",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "groupMeans",
          label: "Group Means",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "centered",
          label: "Centered",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = withinTransformGroupMeanTool.execute;
export default withinTransformGroupMeanTool;
