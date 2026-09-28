import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actualMass: number;
  readonly theoreticalMass: number;
  readonly chargedMass: number;
  readonly useTheoretical: boolean;
};
export type Output = {
  readonly yieldFraction: number;
  readonly denominator: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualMass: { type: "number", minimum: 0 },
    theoreticalMass: { type: "number", exclusiveMinimum: 0 },
    chargedMass: { type: "number", exclusiveMinimum: 0 },
    useTheoretical: { type: "boolean" },
  },
  required: ["actualMass", "theoreticalMass", "chargedMass", "useTheoretical"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yieldFraction: { type: "number" },
    denominator: { type: "number" },
  },
  required: ["yieldFraction", "denominator"],
} as const;
/** Compare supplied batch mass against explicit theoretical or charged bases without a release criterion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actualMass, theoreticalMass, chargedMass, useTheoretical } = request;
  const compute = (): Output => {
    H.domain(actualMass >= 0);
    H.positive(theoreticalMass);
    H.positive(chargedMass);
    return {
      yieldFraction:
        actualMass / (useTheoretical ? theoreticalMass : chargedMass),
      denominator: useTheoretical ? theoreticalMass : chargedMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    actualMass: 80,
    theoreticalMass: 100,
    chargedMass: 125,
    useTheoretical: true,
  },
  output: { yieldFraction: 0.8, denominator: 100 },
} satisfies ToolExample<Input, Output>;
export const gmpYieldReferenceBaseTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/gmp-yield-reference-base-token",
    title: "GMP Yield Reference Base Token Tool",
    description:
      "Compare supplied batch mass against explicit theoretical or charged bases without a release criterion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualMass: { type: "number", minimum: 0 },
        theoreticalMass: { type: "number", exclusiveMinimum: 0 },
        chargedMass: { type: "number", exclusiveMinimum: 0 },
        useTheoretical: { type: "boolean" },
      },
      required: [
        "actualMass",
        "theoreticalMass",
        "chargedMass",
        "useTheoretical",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yieldFraction: { type: "number" },
        denominator: { type: "number" },
      },
      required: ["yieldFraction", "denominator"],
    },
    ports: {
      inputs: [
        {
          id: "actualMass",
          label: "Actual Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "theoreticalMass",
          label: "Theoretical Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "chargedMass",
          label: "Charged Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useTheoretical",
          label: "Use Theoretical",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "yieldFraction",
          label: "Yield Fraction",
          valueType: { type: "number" },
        },
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gmpYieldReferenceBaseTokenTool.execute;
export default gmpYieldReferenceBaseTokenTool;
