import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAmount: number;
  readonly secondAmount: number;
  readonly firstFraction: number;
  readonly secondFraction: number;
  readonly targetFraction: number;
};
export type Output = {
  readonly actualFraction: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAmount: { type: "number", minimum: 0 },
    secondAmount: { type: "number", minimum: 0 },
    firstFraction: { type: "number", minimum: 0, maximum: 1 },
    secondFraction: { type: "number", minimum: 0, maximum: 1 },
    targetFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "firstAmount",
    "secondAmount",
    "firstFraction",
    "secondFraction",
    "targetFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualFraction: { type: "number" },
    residual: { type: "number" },
  },
  required: ["actualFraction", "residual"],
} as const;
/** Calculate mixture target share residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstAmount,
    secondAmount,
    firstFraction,
    secondFraction,
    targetFraction,
  } = request;
  const compute = (): Output => {
    H.domain(
      firstAmount >= 0 && secondAmount >= 0 && firstAmount + secondAmount > 0,
    );
    H.probability(firstFraction);
    H.probability(secondFraction);
    H.probability(targetFraction);
    return {
      actualFraction:
        (firstAmount * firstFraction + secondAmount * secondFraction) /
        (firstAmount + secondAmount),
      residual:
        (firstAmount * firstFraction + secondAmount * secondFraction) /
          (firstAmount + secondAmount) -
        targetFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstAmount: 2,
    secondAmount: 3,
    firstFraction: 0.25,
    secondFraction: 0.5,
    targetFraction: 0.4,
  },
  output: { actualFraction: 0.4, residual: 0 },
} satisfies ToolExample<Input, Output>;
export const mixtureTargetShareResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/mixture-target-share-residual",
    title: "Mixture Target Share Residual Tool",
    description:
      "Calculate mixture target share residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAmount: { type: "number", minimum: 0 },
        secondAmount: { type: "number", minimum: 0 },
        firstFraction: { type: "number", minimum: 0, maximum: 1 },
        secondFraction: { type: "number", minimum: 0, maximum: 1 },
        targetFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "firstAmount",
        "secondAmount",
        "firstFraction",
        "secondFraction",
        "targetFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualFraction: { type: "number" },
        residual: { type: "number" },
      },
      required: ["actualFraction", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "firstAmount",
          label: "First Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondAmount",
          label: "Second Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstFraction",
          label: "First Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondFraction",
          label: "Second Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetFraction",
          label: "Target Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "actualFraction",
          label: "Actual Fraction",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = mixtureTargetShareResidualTool.execute;
export default mixtureTargetShareResidualTool;
