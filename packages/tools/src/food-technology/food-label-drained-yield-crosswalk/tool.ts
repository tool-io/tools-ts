import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly netMass: number;
  readonly drainedMass: number;
  readonly labelPerNetMass: number;
};
export type Output = {
  readonly drainedYield: number;
  readonly perDrainedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netMass: { type: "number", exclusiveMinimum: 0 },
    drainedMass: { type: "number", exclusiveMinimum: 0 },
    labelPerNetMass: { type: "number", minimum: 0 },
  },
  required: ["netMass", "drainedMass", "labelPerNetMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    drainedYield: { type: "number" },
    perDrainedMass: { type: "number" },
  },
  required: ["drainedYield", "perDrainedMass"],
} as const;
/** Crosswalk assuming all of the supplied labeled constituent remains in the drained portion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { netMass, drainedMass, labelPerNetMass } = request;
  const compute = (): Output => {
    H.positive(netMass);
    H.domain(drainedMass > 0 && drainedMass <= netMass && labelPerNetMass >= 0);
    return {
      drainedYield: drainedMass / netMass,
      perDrainedMass: (labelPerNetMass * netMass) / drainedMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { netMass: 200, drainedMass: 100, labelPerNetMass: 10 },
  output: { drainedYield: 0.5, perDrainedMass: 20 },
} satisfies ToolExample<Input, Output>;
export const foodLabelDrainedYieldCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/food-label-drained-yield-crosswalk",
    title: "Food Label Drained Yield Crosswalk Tool",
    description:
      "Crosswalk assuming all of the supplied labeled constituent remains in the drained portion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netMass: { type: "number", exclusiveMinimum: 0 },
        drainedMass: { type: "number", exclusiveMinimum: 0 },
        labelPerNetMass: { type: "number", minimum: 0 },
      },
      required: ["netMass", "drainedMass", "labelPerNetMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        drainedYield: { type: "number" },
        perDrainedMass: { type: "number" },
      },
      required: ["drainedYield", "perDrainedMass"],
    },
    ports: {
      inputs: [
        {
          id: "netMass",
          label: "Net Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drainedMass",
          label: "Drained Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "labelPerNetMass",
          label: "Label Per Net Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "drainedYield",
          label: "Drained Yield",
          valueType: { type: "number" },
        },
        {
          id: "perDrainedMass",
          label: "Per Drained Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodLabelDrainedYieldCrosswalkTool.execute;
export default foodLabelDrainedYieldCrosswalkTool;
