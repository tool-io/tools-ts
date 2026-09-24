import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labels: readonly string[];
  readonly costs: readonly number[];
  readonly tiePolicy: string;
};
export type Output = {
  readonly selected: string;
  readonly selectedIndex: number;
  readonly tiedLabels: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    costs: { type: "array", maxItems: 256, items: { type: "number" } },
    tiePolicy: { type: "string", maxLength: 8192 },
  },
  required: ["labels", "costs", "tiePolicy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selected: { type: "string", maxLength: 8192 },
    selectedIndex: { type: "integer" },
    tiedLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["selected", "selectedIndex", "tiedLabels"],
} as const;
/** Select an exact minimum-cost label with an explicit stable tie policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labels, costs, tiePolicy } = request;
  const compute = (): Output => {
    H.sameLength(labels, costs);
    H.domain(
      labels.length > 0 &&
        new Set(labels).size === labels.length &&
        ["first", "last"].includes(tiePolicy),
    );
    const min = Math.min(...costs),
      indices = costs.flatMap((x, i) => (x === min ? [i] : [])),
      selectedIndex =
        tiePolicy === "first" ? indices[0] : indices[indices.length - 1];
    return {
      selected: labels[selectedIndex],
      selectedIndex,
      tiedLabels: indices.map((i) => labels[i]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { labels: ["a", "b", "c"], costs: [2, 1, 1], tiePolicy: "first" },
  output: { selected: "b", selectedIndex: 1, tiedLabels: ["b", "c"] },
} satisfies ToolExample<Input, Output>;
export const classLabelCostTieSelectorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/class-label-cost-tie-selector",
    title: "Class Label Cost Tie Selector Tool",
    description:
      "Select an exact minimum-cost label with an explicit stable tie policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        costs: { type: "array", maxItems: 256, items: { type: "number" } },
        tiePolicy: { type: "string", maxLength: 8192 },
      },
      required: ["labels", "costs", "tiePolicy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selected: { type: "string", maxLength: 8192 },
        selectedIndex: { type: "integer" },
        tiedLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["selected", "selectedIndex", "tiedLabels"],
    },
    ports: {
      inputs: [
        {
          id: "labels",
          label: "Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "costs",
          label: "Costs",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "tiePolicy",
          label: "Tie Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "selected", label: "Selected", valueType: { type: "string" } },
        {
          id: "selectedIndex",
          label: "Selected Index",
          valueType: { type: "integer" },
        },
        {
          id: "tiedLabels",
          label: "Tied Labels",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = classLabelCostTieSelectorTool.execute;
export default classLabelCostTieSelectorTool;
