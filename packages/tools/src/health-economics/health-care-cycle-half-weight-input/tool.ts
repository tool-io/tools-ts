import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cycleCost: number;
  readonly firstCycle: boolean;
  readonly lastCycle: boolean;
  readonly halfWeightFirst: boolean;
  readonly halfWeightLast: boolean;
};
export type Output = { readonly weight: number; readonly weightedCost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleCost: { type: "number" },
    firstCycle: { type: "boolean" },
    lastCycle: { type: "boolean" },
    halfWeightFirst: { type: "boolean" },
    halfWeightLast: { type: "boolean" },
  },
  required: [
    "cycleCost",
    "firstCycle",
    "lastCycle",
    "halfWeightFirst",
    "halfWeightLast",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weight: { type: "number" }, weightedCost: { type: "number" } },
  required: ["weight", "weightedCost"],
} as const;
/** Apply a caller-selected half-cycle weight once to an explicitly marked boundary cycle without choosing a health model convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cycleCost, firstCycle, lastCycle, halfWeightFirst, halfWeightLast } =
    request;
  const compute = (): Output => {
    return (() => {
      const half =
          (firstCycle && halfWeightFirst) || (lastCycle && halfWeightLast),
        weight = half ? 0.5 : 1;
      return { weight, weightedCost: weight * cycleCost };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cycleCost: 100,
    firstCycle: true,
    lastCycle: false,
    halfWeightFirst: true,
    halfWeightLast: false,
  },
  output: { weight: 0.5, weightedCost: 50 },
} satisfies ToolExample<Input, Output>;
export const healthCareCycleHalfWeightInputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["health-economics", "health economics", "economics"],
      keywords: ["health economics", "economics"],
    },
    id: "health-economics/health-care-cycle-half-weight-input",
    title: "Health Care Cycle Half Weight Input",
    description:
      "Apply a caller-selected half-cycle weight once to an explicitly marked boundary cycle without choosing a health model convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycleCost: { type: "number" },
        firstCycle: { type: "boolean" },
        lastCycle: { type: "boolean" },
        halfWeightFirst: { type: "boolean" },
        halfWeightLast: { type: "boolean" },
      },
      required: [
        "cycleCost",
        "firstCycle",
        "lastCycle",
        "halfWeightFirst",
        "halfWeightLast",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weight: { type: "number" },
        weightedCost: { type: "number" },
      },
      required: ["weight", "weightedCost"],
    },
    ports: {
      inputs: [
        {
          id: "cycleCost",
          label: "Cycle Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstCycle",
          label: "First Cycle",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "lastCycle",
          label: "Last Cycle",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "halfWeightFirst",
          label: "Half Weight First",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "halfWeightLast",
          label: "Half Weight Last",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "weight", label: "Weight", valueType: { type: "number" } },
        {
          id: "weightedCost",
          label: "Weighted Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = healthCareCycleHalfWeightInputTool.execute;
export default healthCareCycleHalfWeightInputTool;
