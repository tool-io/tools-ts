import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseBenefit: number;
  readonly excessBase: number;
  readonly suppliedStepWidth: number;
  readonly reductionPerStep: number;
  readonly partialStepCounts: boolean;
};
export type Output = { readonly steps: number; readonly benefit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseBenefit: { type: "number", minimum: 0 },
    excessBase: { type: "number" },
    suppliedStepWidth: { type: "number", exclusiveMinimum: 0 },
    reductionPerStep: { type: "number", minimum: 0 },
    partialStepCounts: { type: "boolean" },
  },
  required: [
    "baseBenefit",
    "excessBase",
    "suppliedStepWidth",
    "reductionPerStep",
    "partialStepCounts",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { steps: { type: "integer" }, benefit: { type: "number" } },
  required: ["steps", "benefit"],
} as const;
/** Apply caller-supplied discrete benefit reduction assumptions without selecting statutory phaseout rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    baseBenefit,
    excessBase,
    suppliedStepWidth,
    reductionPerStep,
    partialStepCounts,
  } = request;
  const compute = (): Output => {
    H.positive(suppliedStepWidth);
    H.domain(baseBenefit >= 0 && reductionPerStep >= 0);
    return {
      steps: partialStepCounts
        ? Math.ceil(Math.max(0, excessBase) / suppliedStepWidth)
        : Math.floor(Math.max(0, excessBase) / suppliedStepWidth),
      benefit: Math.max(
        0,
        baseBenefit -
          (partialStepCounts
            ? Math.ceil(Math.max(0, excessBase) / suppliedStepWidth)
            : Math.floor(Math.max(0, excessBase) / suppliedStepWidth)) *
            reductionPerStep,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baseBenefit: 100,
    excessBase: 25,
    suppliedStepWidth: 10,
    reductionPerStep: 20,
    partialStepCounts: true,
  },
  output: { steps: 3, benefit: 40 },
} satisfies ToolExample<Input, Output>;
export const serviceBenefitPhaseoutStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/service-benefit-phaseout-step",
    title: "Service Benefit Phaseout Step Tool",
    description:
      "Apply caller-supplied discrete benefit reduction assumptions without selecting statutory phaseout rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseBenefit: { type: "number", minimum: 0 },
        excessBase: { type: "number" },
        suppliedStepWidth: { type: "number", exclusiveMinimum: 0 },
        reductionPerStep: { type: "number", minimum: 0 },
        partialStepCounts: { type: "boolean" },
      },
      required: [
        "baseBenefit",
        "excessBase",
        "suppliedStepWidth",
        "reductionPerStep",
        "partialStepCounts",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { steps: { type: "integer" }, benefit: { type: "number" } },
      required: ["steps", "benefit"],
    },
    ports: {
      inputs: [
        {
          id: "baseBenefit",
          label: "Base Benefit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excessBase",
          label: "Excess Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedStepWidth",
          label: "Supplied Step Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reductionPerStep",
          label: "Reduction Per Step",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "partialStepCounts",
          label: "Partial Step Counts",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "steps", label: "Steps", valueType: { type: "integer" } },
        { id: "benefit", label: "Benefit", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = serviceBenefitPhaseoutStepTool.execute;
export default serviceBenefitPhaseoutStepTool;
