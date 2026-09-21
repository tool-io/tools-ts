import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mass: number;
  readonly referenceMass: number;
  readonly exponent: number;
};
export type Output = { readonly relativeTerm: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", exclusiveMinimum: 0 },
    referenceMass: { type: "number", exclusiveMinimum: 0 },
    exponent: { type: "number" },
  },
  required: ["mass", "referenceMass", "exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeTerm: { type: "number" } },
  required: ["relativeTerm"],
} as const;
/** Evaluate a caller-supplied nonclinical relative allometric mass term without universal species coefficients. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, referenceMass, exponent } = request;
  const compute = (): Output => {
    H.positive(mass);
    H.positive(referenceMass);
    return {
      relativeTerm: Math.exp(
        exponent * (Math.log(mass) - Math.log(referenceMass)),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mass: 4, referenceMass: 1, exponent: 0.5 },
  output: { relativeTerm: 2 },
} satisfies ToolExample<Input, Output>;
export const bodyMassAllometricExponentTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/body-mass-allometric-exponent-term",
    title: "Body Mass Allometric Exponent Term Tool",
    description:
      "Evaluate a caller-supplied nonclinical relative allometric mass term without universal species coefficients.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mass: { type: "number", exclusiveMinimum: 0 },
        referenceMass: { type: "number", exclusiveMinimum: 0 },
        exponent: { type: "number" },
      },
      required: ["mass", "referenceMass", "exponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeTerm: { type: "number" } },
      required: ["relativeTerm"],
    },
    ports: {
      inputs: [
        {
          id: "mass",
          label: "Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceMass",
          label: "Reference Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exponent",
          label: "Exponent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeTerm",
          label: "Relative Term",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bodyMassAllometricExponentTermTool.execute;
export default bodyMassAllometricExponentTermTool;
