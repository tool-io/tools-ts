import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstActivity: number;
  readonly secondActivity: number;
  readonly sharedActivity: number;
  readonly emissionFactor: number;
};
export type Output = {
  readonly uniqueActivity: number;
  readonly emission: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstActivity: { type: "number", minimum: 0 },
    secondActivity: { type: "number", minimum: 0 },
    sharedActivity: { type: "number", minimum: 0 },
    emissionFactor: { type: "number", minimum: 0 },
  },
  required: [
    "firstActivity",
    "secondActivity",
    "sharedActivity",
    "emissionFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueActivity: { type: "number" },
    emission: { type: "number" },
  },
  required: ["uniqueActivity", "emission"],
} as const;
/** Calculate emission activity overlap deduction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstActivity, secondActivity, sharedActivity, emissionFactor } =
    request;
  const compute = (): Output => {
    H.domain(
      firstActivity >= 0 &&
        secondActivity >= 0 &&
        sharedActivity >= 0 &&
        sharedActivity <= Math.min(firstActivity, secondActivity) &&
        emissionFactor >= 0,
    );
    return {
      uniqueActivity: firstActivity + secondActivity - sharedActivity,
      emission:
        (firstActivity + secondActivity - sharedActivity) * emissionFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstActivity: 100,
    secondActivity: 80,
    sharedActivity: 30,
    emissionFactor: 2,
  },
  output: { uniqueActivity: 150, emission: 300 },
} satisfies ToolExample<Input, Output>;
export const emissionActivityOverlapDeductionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/emission-activity-overlap-deduction",
    title: "Emission Activity Overlap Deduction Tool",
    description:
      "Calculate emission activity overlap deduction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstActivity: { type: "number", minimum: 0 },
        secondActivity: { type: "number", minimum: 0 },
        sharedActivity: { type: "number", minimum: 0 },
        emissionFactor: { type: "number", minimum: 0 },
      },
      required: [
        "firstActivity",
        "secondActivity",
        "sharedActivity",
        "emissionFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueActivity: { type: "number" },
        emission: { type: "number" },
      },
      required: ["uniqueActivity", "emission"],
    },
    ports: {
      inputs: [
        {
          id: "firstActivity",
          label: "First Activity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondActivity",
          label: "Second Activity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedActivity",
          label: "Shared Activity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "emissionFactor",
          label: "Emission Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uniqueActivity",
          label: "Unique Activity",
          valueType: { type: "number" },
        },
        { id: "emission", label: "Emission", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = emissionActivityOverlapDeductionTool.execute;
export default emissionActivityOverlapDeductionTool;
