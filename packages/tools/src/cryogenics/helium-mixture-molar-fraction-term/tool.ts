import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstMoles: number;
  readonly secondMoles: number;
  readonly firstMolarMass: number;
  readonly secondMolarMass: number;
};
export type Output = {
  readonly firstMoleFraction: number;
  readonly firstMassFraction: number;
  readonly meanMolarMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstMoles: { type: "number", minimum: 0 },
    secondMoles: { type: "number", minimum: 0 },
    firstMolarMass: { type: "number", exclusiveMinimum: 0 },
    secondMolarMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstMoles", "secondMoles", "firstMolarMass", "secondMolarMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstMoleFraction: { type: "number" },
    firstMassFraction: { type: "number" },
    meanMolarMass: { type: "number" },
  },
  required: ["firstMoleFraction", "firstMassFraction", "meanMolarMass"],
} as const;
/** Explicit two-component isotope-mixture mass/mole balance, without assuming isotope abundance or a phase diagram. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstMoles, secondMoles, firstMolarMass, secondMolarMass } = request;
  const compute = (): Output => {
    H.domain(
      firstMoles >= 0 && secondMoles >= 0 && firstMoles + secondMoles > 0,
    );
    H.positive(firstMolarMass);
    H.positive(secondMolarMass);
    return {
      firstMoleFraction: firstMoles / (firstMoles + secondMoles),
      firstMassFraction:
        (firstMoles * firstMolarMass) /
        (firstMoles * firstMolarMass + secondMoles * secondMolarMass),
      meanMolarMass:
        (firstMoles * firstMolarMass + secondMoles * secondMolarMass) /
        (firstMoles + secondMoles),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstMoles: 1,
    secondMoles: 1,
    firstMolarMass: 3,
    secondMolarMass: 4,
  },
  output: {
    firstMoleFraction: 0.5,
    firstMassFraction: 0.42857142857142855,
    meanMolarMass: 3.5,
  },
} satisfies ToolExample<Input, Output>;
export const heliumMixtureMolarFractionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/helium-mixture-molar-fraction-term",
    title: "Helium Mixture Molar Fraction Term Tool",
    description:
      "Explicit two-component isotope-mixture mass/mole balance, without assuming isotope abundance or a phase diagram.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstMoles: { type: "number", minimum: 0 },
        secondMoles: { type: "number", minimum: 0 },
        firstMolarMass: { type: "number", exclusiveMinimum: 0 },
        secondMolarMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "firstMoles",
        "secondMoles",
        "firstMolarMass",
        "secondMolarMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstMoleFraction: { type: "number" },
        firstMassFraction: { type: "number" },
        meanMolarMass: { type: "number" },
      },
      required: ["firstMoleFraction", "firstMassFraction", "meanMolarMass"],
    },
    ports: {
      inputs: [
        {
          id: "firstMoles",
          label: "First Moles",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondMoles",
          label: "Second Moles",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstMolarMass",
          label: "First Molar Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondMolarMass",
          label: "Second Molar Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstMoleFraction",
          label: "First Mole Fraction",
          valueType: { type: "number" },
        },
        {
          id: "firstMassFraction",
          label: "First Mass Fraction",
          valueType: { type: "number" },
        },
        {
          id: "meanMolarMass",
          label: "Mean Molar Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = heliumMixtureMolarFractionTermTool.execute;
export default heliumMixtureMolarFractionTermTool;
