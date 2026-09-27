import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalWater: number;
  readonly boundWater: number;
  readonly flourMass: number;
  readonly excludeBound: boolean;
};
export type Output = {
  readonly countedWater: number;
  readonly hydrationRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalWater: { type: "number", minimum: 0 },
    boundWater: { type: "number", minimum: 0 },
    flourMass: { type: "number", exclusiveMinimum: 0 },
    excludeBound: { type: "boolean" },
  },
  required: ["totalWater", "boundWater", "flourMass", "excludeBound"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedWater: { type: "number" },
    hydrationRatio: { type: "number" },
  },
  required: ["countedWater", "hydrationRatio"],
} as const;
/** Compare supplied total/free-water accounting bases without estimating water binding or prescribing a formula. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalWater, boundWater, flourMass, excludeBound } = request;
  const compute = (): Output => {
    H.positive(flourMass);
    H.domain(totalWater >= 0 && boundWater >= 0 && boundWater <= totalWater);
    return {
      countedWater: totalWater - (excludeBound ? boundWater : 0),
      hydrationRatio:
        (totalWater - (excludeBound ? boundWater : 0)) / flourMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalWater: 60, boundWater: 10, flourMass: 100, excludeBound: true },
  output: { countedWater: 50, hydrationRatio: 0.5 },
} satisfies ToolExample<Input, Output>;
export const doughWaterBindingBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/dough-water-binding-base-flag",
    title: "Dough Water Binding Base Flag Tool",
    description:
      "Compare supplied total/free-water accounting bases without estimating water binding or prescribing a formula.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalWater: { type: "number", minimum: 0 },
        boundWater: { type: "number", minimum: 0 },
        flourMass: { type: "number", exclusiveMinimum: 0 },
        excludeBound: { type: "boolean" },
      },
      required: ["totalWater", "boundWater", "flourMass", "excludeBound"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedWater: { type: "number" },
        hydrationRatio: { type: "number" },
      },
      required: ["countedWater", "hydrationRatio"],
    },
    ports: {
      inputs: [
        {
          id: "totalWater",
          label: "Total Water",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boundWater",
          label: "Bound Water",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "flourMass",
          label: "Flour Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeBound",
          label: "Exclude Bound",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "countedWater",
          label: "Counted Water",
          valueType: { type: "number" },
        },
        {
          id: "hydrationRatio",
          label: "Hydration Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = doughWaterBindingBaseFlagTool.execute;
export default doughWaterBindingBaseFlagTool;
