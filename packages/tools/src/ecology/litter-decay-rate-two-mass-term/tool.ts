import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialMass: number;
  readonly remainingMass: number;
  readonly elapsedYears: number;
  readonly initialAsh: number;
  readonly remainingAsh: number;
};
export type Output = {
  readonly retainedFraction: number;
  readonly decayConstant: number;
  readonly halfLifeYears: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialMass: { type: "number" },
    remainingMass: { type: "number" },
    elapsedYears: { type: "number", exclusiveMinimum: 0 },
    initialAsh: { type: "number", minimum: 0 },
    remainingAsh: { type: "number", minimum: 0 },
  },
  required: [
    "initialMass",
    "remainingMass",
    "elapsedYears",
    "initialAsh",
    "remainingAsh",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedFraction: { type: "number" },
    decayConstant: { type: "number" },
    halfLifeYears: { type: "number" },
  },
  required: ["retainedFraction", "decayConstant", "halfLifeYears"],
} as const;
/** Exponential two-point decay from ash-free dry masses; strictly positive decay is required for a finite positive half-life. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialMass, remainingMass, elapsedYears, initialAsh, remainingAsh } =
    request;
  const compute = (): Output => {
    H.domain(
      initialMass > initialAsh &&
        initialAsh >= 0 &&
        remainingMass > remainingAsh &&
        remainingAsh >= 0 &&
        remainingMass - remainingAsh < initialMass - initialAsh,
    );
    H.positive(elapsedYears);
    return {
      retainedFraction:
        (remainingMass - remainingAsh) / (initialMass - initialAsh),
      decayConstant:
        -Math.log((remainingMass - remainingAsh) / (initialMass - initialAsh)) /
        elapsedYears,
      halfLifeYears:
        (Math.LN2 * elapsedYears) /
        -Math.log((remainingMass - remainingAsh) / (initialMass - initialAsh)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialMass: 100,
    remainingMass: 55,
    elapsedYears: 1,
    initialAsh: 10,
    remainingAsh: 10,
  },
  output: {
    retainedFraction: 0.5,
    decayConstant: 0.6931471805599453,
    halfLifeYears: 1,
  },
} satisfies ToolExample<Input, Output>;
export const litterDecayRateTwoMassTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/litter-decay-rate-two-mass-term",
    title: "Litter Decay Rate Two Mass Term Tool",
    description:
      "Exponential two-point decay from ash-free dry masses; strictly positive decay is required for a finite positive half-life.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialMass: { type: "number" },
        remainingMass: { type: "number" },
        elapsedYears: { type: "number", exclusiveMinimum: 0 },
        initialAsh: { type: "number", minimum: 0 },
        remainingAsh: { type: "number", minimum: 0 },
      },
      required: [
        "initialMass",
        "remainingMass",
        "elapsedYears",
        "initialAsh",
        "remainingAsh",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedFraction: { type: "number" },
        decayConstant: { type: "number" },
        halfLifeYears: { type: "number" },
      },
      required: ["retainedFraction", "decayConstant", "halfLifeYears"],
    },
    ports: {
      inputs: [
        {
          id: "initialMass",
          label: "Initial Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "remainingMass",
          label: "Remaining Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedYears",
          label: "Elapsed Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialAsh",
          label: "Initial Ash",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "remainingAsh",
          label: "Remaining Ash",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "retainedFraction",
          label: "Retained Fraction",
          valueType: { type: "number" },
        },
        {
          id: "decayConstant",
          label: "Decay Constant",
          valueType: { type: "number" },
        },
        {
          id: "halfLifeYears",
          label: "Half Life Years",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = litterDecayRateTwoMassTermTool.execute;
export default litterDecayRateTwoMassTermTool;
