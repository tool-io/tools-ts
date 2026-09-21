import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeMass: number;
  readonly afterMass: number;
  readonly regrowth: number;
  readonly nonIntakeLoss: number;
  readonly animals: number;
};
export type Output = {
  readonly estimatedIntake: number;
  readonly intakePerAnimal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeMass: { type: "number", minimum: 0 },
    afterMass: { type: "number", minimum: 0 },
    regrowth: { type: "number", minimum: 0 },
    nonIntakeLoss: { type: "number", minimum: 0 },
    animals: { type: "integer", minimum: 1 },
  },
  required: ["beforeMass", "afterMass", "regrowth", "nonIntakeLoss", "animals"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    estimatedIntake: { type: "number" },
    intakePerAnimal: { type: "number" },
  },
  required: ["estimatedIntake", "intakePerAnimal"],
} as const;
/** Signed disappearance estimate with explicit regrowth and non-intake losses; not a direct intake measurement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforeMass, afterMass, regrowth, nonIntakeLoss, animals } = request;
  const compute = (): Output => {
    H.domain(
      beforeMass >= 0 && afterMass >= 0 && regrowth >= 0 && nonIntakeLoss >= 0,
    );
    H.integer(animals, 1);
    return {
      estimatedIntake: beforeMass - afterMass + regrowth - nonIntakeLoss,
      intakePerAnimal:
        (beforeMass - afterMass + regrowth - nonIntakeLoss) / animals,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    beforeMass: 1000,
    afterMass: 600,
    regrowth: 50,
    nonIntakeLoss: 100,
    animals: 10,
  },
  output: { estimatedIntake: 350, intakePerAnimal: 35 },
} satisfies ToolExample<Input, Output>;
export const pastureIntakePrePostMassGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/pasture-intake-pre-post-mass-gap",
    title: "Pasture Intake Pre Post Mass Gap Tool",
    description:
      "Signed disappearance estimate with explicit regrowth and non-intake losses; not a direct intake measurement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeMass: { type: "number", minimum: 0 },
        afterMass: { type: "number", minimum: 0 },
        regrowth: { type: "number", minimum: 0 },
        nonIntakeLoss: { type: "number", minimum: 0 },
        animals: { type: "integer", minimum: 1 },
      },
      required: [
        "beforeMass",
        "afterMass",
        "regrowth",
        "nonIntakeLoss",
        "animals",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        estimatedIntake: { type: "number" },
        intakePerAnimal: { type: "number" },
      },
      required: ["estimatedIntake", "intakePerAnimal"],
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
          id: "regrowth",
          label: "Regrowth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nonIntakeLoss",
          label: "Non Intake Loss",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "animals",
          label: "Animals",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "estimatedIntake",
          label: "Estimated Intake",
          valueType: { type: "number" },
        },
        {
          id: "intakePerAnimal",
          label: "Intake Per Animal",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pastureIntakePrePostMassGapTool.execute;
export default pastureIntakePrePostMassGapTool;
