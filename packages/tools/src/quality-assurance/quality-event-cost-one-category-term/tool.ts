import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hours: number;
  readonly hourlyCost: number;
  readonly materialCost: number;
  readonly externalCost: number;
  readonly recovered: number;
  readonly allocatedShare: number;
};
export type Output = {
  readonly gross: number;
  readonly net: number;
  readonly allocated: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hours: { type: "number", minimum: 0 },
    hourlyCost: { type: "number", minimum: 0 },
    materialCost: { type: "number", minimum: 0 },
    externalCost: { type: "number", minimum: 0 },
    recovered: { type: "number", minimum: 0 },
    allocatedShare: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "hours",
    "hourlyCost",
    "materialCost",
    "externalCost",
    "recovered",
    "allocatedShare",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gross: { type: "number" },
    net: { type: "number" },
    allocated: { type: "number" },
  },
  required: ["gross", "net", "allocated"],
} as const;
/** Calculate quality event cost one category term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    hours,
    hourlyCost,
    materialCost,
    externalCost,
    recovered,
    allocatedShare,
  } = request;
  const compute = (): Output => {
    H.domain(
      hours >= 0 &&
        hourlyCost >= 0 &&
        materialCost >= 0 &&
        externalCost >= 0 &&
        recovered >= 0,
    );
    H.probability(allocatedShare);
    return {
      gross: hours * hourlyCost + materialCost + externalCost,
      net: hours * hourlyCost + materialCost + externalCost - recovered,
      allocated:
        (hours * hourlyCost + materialCost + externalCost - recovered) *
        allocatedShare,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    hours: 3,
    hourlyCost: 40,
    materialCost: 20,
    externalCost: 50,
    recovered: 10,
    allocatedShare: 0.5,
  },
  output: { gross: 190, net: 180, allocated: 90 },
} satisfies ToolExample<Input, Output>;
export const qualityEventCostOneCategoryTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/quality-event-cost-one-category-term",
    title: "Quality Event Cost One Category Term Tool",
    description:
      "Calculate quality event cost one category term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hours: { type: "number", minimum: 0 },
        hourlyCost: { type: "number", minimum: 0 },
        materialCost: { type: "number", minimum: 0 },
        externalCost: { type: "number", minimum: 0 },
        recovered: { type: "number", minimum: 0 },
        allocatedShare: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "hours",
        "hourlyCost",
        "materialCost",
        "externalCost",
        "recovered",
        "allocatedShare",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gross: { type: "number" },
        net: { type: "number" },
        allocated: { type: "number" },
      },
      required: ["gross", "net", "allocated"],
    },
    ports: {
      inputs: [
        {
          id: "hours",
          label: "Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hourlyCost",
          label: "Hourly Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "materialCost",
          label: "Material Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "externalCost",
          label: "External Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recovered",
          label: "Recovered",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allocatedShare",
          label: "Allocated Share",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gross", label: "Gross", valueType: { type: "number" } },
        { id: "net", label: "Net", valueType: { type: "number" } },
        { id: "allocated", label: "Allocated", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = qualityEventCostOneCategoryTermTool.execute;
export default qualityEventCostOneCategoryTermTool;
