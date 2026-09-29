import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mass: number;
  readonly length: number;
  readonly suppliedExponent: number;
  readonly suppliedScale: number;
};
export type Output = { readonly conditionTerm: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", minimum: 0 },
    length: { type: "number", exclusiveMinimum: 0 },
    suppliedExponent: { type: "number" },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["mass", "length", "suppliedExponent", "suppliedScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { conditionTerm: { type: "number" } },
  required: ["conditionTerm"],
} as const;
/** Evaluate an explicitly supplied mass/length-power index; exponent, scale and unit convention are caller-defined, without biological thresholds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, length, suppliedExponent, suppliedScale } = request;
  const compute = (): Output => {
    H.domain(mass >= 0);
    H.positive(length);
    H.positive(suppliedScale);
    return {
      conditionTerm: (suppliedScale * mass) / length ** suppliedExponent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mass: 2, length: 2, suppliedExponent: 3, suppliedScale: 100 },
  output: { conditionTerm: 25 },
} satisfies ToolExample<Input, Output>;
export const fishMassLengthConditionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/fish-mass-length-condition-term",
    title: "Fish Mass Length Condition Term Tool",
    description:
      "Evaluate an explicitly supplied mass/length-power index; exponent, scale and unit convention are caller-defined, without biological thresholds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mass: { type: "number", minimum: 0 },
        length: { type: "number", exclusiveMinimum: 0 },
        suppliedExponent: { type: "number" },
        suppliedScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["mass", "length", "suppliedExponent", "suppliedScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { conditionTerm: { type: "number" } },
      required: ["conditionTerm"],
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
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedExponent",
          label: "Supplied Exponent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "conditionTerm",
          label: "Condition Term",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fishMassLengthConditionTermTool.execute;
export default fishMassLengthConditionTermTool;
