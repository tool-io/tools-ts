import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly universe: number;
  readonly subsetA: number;
  readonly subsetB: number;
  readonly requiredIntersection: number;
};
export type Output = {
  readonly minimumIntersection: number;
  readonly maximumIntersection: number;
  readonly feasible: boolean;
  readonly unionSize: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    universe: { type: "integer", minimum: 0 },
    subsetA: { type: "integer", minimum: 0 },
    subsetB: { type: "integer", minimum: 0 },
    requiredIntersection: { type: "integer", minimum: 0 },
  },
  required: ["universe", "subsetA", "subsetB", "requiredIntersection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumIntersection: { type: "integer" },
    maximumIntersection: { type: "integer" },
    feasible: { type: "boolean" },
    unionSize: { type: "integer" },
  },
  required: [
    "minimumIntersection",
    "maximumIntersection",
    "feasible",
    "unionSize",
  ],
} as const;
/** Calculate subset fixed intersection budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { universe, subsetA, subsetB, requiredIntersection } = request;
  const compute = (): Output => {
    H.integer(universe, 0);
    H.integer(subsetA, 0, universe);
    H.integer(subsetB, 0, universe);
    H.integer(requiredIntersection, 0);
    return {
      minimumIntersection: Math.max(0, subsetA + subsetB - universe),
      maximumIntersection: Math.min(subsetA, subsetB),
      feasible:
        requiredIntersection >= Math.max(0, subsetA + subsetB - universe) &&
        requiredIntersection <= Math.min(subsetA, subsetB),
      unionSize: subsetA + subsetB - requiredIntersection,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { universe: 10, subsetA: 6, subsetB: 7, requiredIntersection: 3 },
  output: {
    minimumIntersection: 3,
    maximumIntersection: 6,
    feasible: true,
    unionSize: 10,
  },
} satisfies ToolExample<Input, Output>;
export const subsetFixedIntersectionBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/subset-fixed-intersection-budget",
    title: "Subset Fixed Intersection Budget Tool",
    description:
      "Calculate subset fixed intersection budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        universe: { type: "integer", minimum: 0 },
        subsetA: { type: "integer", minimum: 0 },
        subsetB: { type: "integer", minimum: 0 },
        requiredIntersection: { type: "integer", minimum: 0 },
      },
      required: ["universe", "subsetA", "subsetB", "requiredIntersection"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimumIntersection: { type: "integer" },
        maximumIntersection: { type: "integer" },
        feasible: { type: "boolean" },
        unionSize: { type: "integer" },
      },
      required: [
        "minimumIntersection",
        "maximumIntersection",
        "feasible",
        "unionSize",
      ],
    },
    ports: {
      inputs: [
        {
          id: "universe",
          label: "Universe",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "subsetA",
          label: "Subset A",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "subsetB",
          label: "Subset B",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "requiredIntersection",
          label: "Required Intersection",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "minimumIntersection",
          label: "Minimum Intersection",
          valueType: { type: "integer" },
        },
        {
          id: "maximumIntersection",
          label: "Maximum Intersection",
          valueType: { type: "integer" },
        },
        { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
        {
          id: "unionSize",
          label: "Union Size",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = subsetFixedIntersectionBudgetTool.execute;
export default subsetFixedIntersectionBudgetTool;
