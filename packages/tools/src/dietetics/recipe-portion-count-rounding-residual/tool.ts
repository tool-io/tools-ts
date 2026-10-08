import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recipeMass: number;
  readonly portionMass: number;
};
export type Output = {
  readonly wholePortions: number;
  readonly leftoverMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recipeMass: { type: "number", minimum: 0 },
    portionMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recipeMass", "portionMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wholePortions: { type: "integer" },
    leftoverMass: { type: "number" },
  },
  required: ["wholePortions", "leftoverMass"],
} as const;
/** Split supplied recipe mass into floor-count equal portions and unallocated mass without rounding portion sizes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recipeMass, portionMass } = request;
  const compute = (): Output => {
    H.domain(recipeMass >= 0, "recipeMass");
    (H.domain(Number.isFinite(portionMass) && portionMass > 0, "portionMass"),
      portionMass);
    return (() => {
      const wholePortions = Math.floor(recipeMass / portionMass);
      return { wholePortions, leftoverMass: recipeMass % portionMass };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recipeMass: 1000, portionMass: 300 },
  output: { wholePortions: 3, leftoverMass: 100 },
} satisfies ToolExample<Input, Output>;
export const recipePortionCountRoundingResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/recipe-portion-count-rounding-residual",
    title: "Recipe Portion Count Rounding Residual Tool",
    description:
      "Split supplied recipe mass into floor-count equal portions and unallocated mass without rounding portion sizes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recipeMass: { type: "number", minimum: 0 },
        portionMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recipeMass", "portionMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wholePortions: { type: "integer" },
        leftoverMass: { type: "number" },
      },
      required: ["wholePortions", "leftoverMass"],
    },
    ports: {
      inputs: [
        {
          id: "recipeMass",
          label: "Recipe Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "portionMass",
          label: "Portion Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wholePortions",
          label: "Whole Portions",
          valueType: { type: "integer" },
        },
        {
          id: "leftoverMass",
          label: "Leftover Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = recipePortionCountRoundingResidualTool.execute;
export default recipePortionCountRoundingResidualTool;
