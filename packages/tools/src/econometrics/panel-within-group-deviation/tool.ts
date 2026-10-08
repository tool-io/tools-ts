import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly values: readonly number[];
  readonly groupCodes: readonly string[];
};
export type Output = {
  readonly withinDeviations: readonly number[];
  readonly groupMeans: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: { type: "array", maxItems: 256, items: { type: "number" } },
    groupCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["values", "groupCodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    withinDeviations: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    groupMeans: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["withinDeviations", "groupMeans"],
} as const;
/** Subtract explicit group means from a numeric panel vector, preserving original row order without fitting a fixed-effects model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { values, groupCodes } = request;
  const compute = (): Output => {
    H.domain(values.length === groupCodes.length, "groupCodes");
    const sums = new Map<string, { sum: number; count: number }>();
    values.forEach((v, i) => {
      const old = sums.get(groupCodes[i]) ?? { sum: 0, count: 0 };
      sums.set(groupCodes[i], { sum: old.sum + v, count: old.count + 1 });
    });
    const groupMeans = groupCodes.map((g) => {
      const row = sums.get(g);
      H.domain(row !== undefined, "groupCodes");
      return row.sum / row.count;
    });
    return {
      withinDeviations: values.map((v, i) => v - groupMeans[i]),
      groupMeans,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { values: [2, 4, 10, 14], groupCodes: ["A", "A", "B", "B"] },
  output: { withinDeviations: [-1, 1, -2, 2], groupMeans: [3, 3, 12, 12] },
} satisfies ToolExample<Input, Output>;
export const panelWithinGroupDeviationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["econometrics", "economics"],
      keywords: ["econometrics", "economics"],
    },
    id: "econometrics/panel-within-group-deviation",
    title: "Panel Within Group Deviation",
    description:
      "Subtract explicit group means from a numeric panel vector, preserving original row order without fitting a fixed-effects model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: { type: "array", maxItems: 256, items: { type: "number" } },
        groupCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["values", "groupCodes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        withinDeviations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        groupMeans: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["withinDeviations", "groupMeans"],
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
          id: "groupCodes",
          label: "Group Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "withinDeviations",
          label: "Within Deviations",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "groupMeans",
          label: "Group Means",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = panelWithinGroupDeviationTool.execute;
export default panelWithinGroupDeviationTool;
