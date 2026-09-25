import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeMass: number;
  readonly afterMass: number;
  readonly measuredWaterLoss: number;
};
export type Output = {
  readonly measuredMassLoss: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeMass: { type: "number", minimum: 0 },
    afterMass: { type: "number", minimum: 0 },
    measuredWaterLoss: { type: "number", minimum: 0 },
  },
  required: ["beforeMass", "afterMass", "measuredWaterLoss"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredMassLoss: { type: "number" },
    residual: { type: "number" },
  },
  required: ["measuredMassLoss", "residual"],
} as const;
/** Compare measured recipe mass change with measured water loss; no moisture-based yield conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforeMass, afterMass, measuredWaterLoss } = request;
  const compute = (): Output => {
    H.domain(beforeMass >= 0 && afterMass >= 0 && measuredWaterLoss >= 0);
    return {
      measuredMassLoss: beforeMass - afterMass,
      residual: beforeMass - afterMass - measuredWaterLoss,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beforeMass: 100, afterMass: 80, measuredWaterLoss: 15 },
  output: { measuredMassLoss: 20, residual: 5 },
} satisfies ToolExample<Input, Output>;
export const recipeYieldMoistureGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/recipe-yield-moisture-gap",
    title: "Recipe Yield Moisture Gap Tool",
    description:
      "Compare measured recipe mass change with measured water loss; no moisture-based yield conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeMass: { type: "number", minimum: 0 },
        afterMass: { type: "number", minimum: 0 },
        measuredWaterLoss: { type: "number", minimum: 0 },
      },
      required: ["beforeMass", "afterMass", "measuredWaterLoss"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredMassLoss: { type: "number" },
        residual: { type: "number" },
      },
      required: ["measuredMassLoss", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "beforeMass",
          label: "Before Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterMass",
          label: "After Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredWaterLoss",
          label: "Measured Water Loss",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "measuredMassLoss",
          label: "Measured Mass Loss",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = recipeYieldMoistureGapTool.execute;
export default recipeYieldMoistureGapTool;
