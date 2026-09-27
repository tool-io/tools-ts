import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialParent: number;
  readonly initialDaughter: number;
  readonly decayConstant: number;
  readonly time: number;
};
export type Output = {
  readonly remainingParent: number;
  readonly radiogenicDaughter: number;
  readonly totalDaughter: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialParent: { type: "number", minimum: 0 },
    initialDaughter: { type: "number", minimum: 0 },
    decayConstant: { type: "number", minimum: 0 },
    time: { type: "number", minimum: 0 },
  },
  required: ["initialParent", "initialDaughter", "decayConstant", "time"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingParent: { type: "number" },
    radiogenicDaughter: { type: "number" },
    totalDaughter: { type: "number" },
  },
  required: ["remainingParent", "radiogenicDaughter", "totalDaughter"],
} as const;
/** Closed-system one-parent-to-one-stable-daughter decay without intermediate chains. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialParent, initialDaughter, decayConstant, time } = request;
  const compute = (): Output => {
    H.domain(
      initialParent >= 0 &&
        initialDaughter >= 0 &&
        decayConstant >= 0 &&
        time >= 0,
    );
    return {
      remainingParent: initialParent * Math.exp(-decayConstant * time),
      radiogenicDaughter: -initialParent * Math.expm1(-decayConstant * time),
      totalDaughter:
        initialDaughter - initialParent * Math.expm1(-decayConstant * time),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialParent: 100,
    initialDaughter: 20,
    decayConstant: 0.6931471805599453,
    time: 1,
  },
  output: { remainingParent: 50, radiogenicDaughter: 50, totalDaughter: 70 },
} satisfies ToolExample<Input, Output>;
export const isotopeParentDaughterDecayOneStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/isotope-parent-daughter-decay-one-step",
    title: "Isotope Parent Daughter Decay One Step Tool",
    description:
      "Closed-system one-parent-to-one-stable-daughter decay without intermediate chains.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialParent: { type: "number", minimum: 0 },
        initialDaughter: { type: "number", minimum: 0 },
        decayConstant: { type: "number", minimum: 0 },
        time: { type: "number", minimum: 0 },
      },
      required: ["initialParent", "initialDaughter", "decayConstant", "time"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingParent: { type: "number" },
        radiogenicDaughter: { type: "number" },
        totalDaughter: { type: "number" },
      },
      required: ["remainingParent", "radiogenicDaughter", "totalDaughter"],
    },
    ports: {
      inputs: [
        {
          id: "initialParent",
          label: "Initial Parent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialDaughter",
          label: "Initial Daughter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "decayConstant",
          label: "Decay Constant",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "time",
          label: "Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingParent",
          label: "Remaining Parent",
          valueType: { type: "number" },
        },
        {
          id: "radiogenicDaughter",
          label: "Radiogenic Daughter",
          valueType: { type: "number" },
        },
        {
          id: "totalDaughter",
          label: "Total Daughter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = isotopeParentDaughterDecayOneStepTool.execute;
export default isotopeParentDaughterDecayOneStepTool;
