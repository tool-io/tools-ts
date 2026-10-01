import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly thrust: number;
  readonly deductionFraction: number;
};
export type Output = {
  readonly effectiveThrust: number;
  readonly deduction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    thrust: { type: "number", minimum: 0 },
    deductionFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["thrust", "deductionFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveThrust: { type: "number" },
    deduction: { type: "number" },
  },
  required: ["effectiveThrust", "deduction"],
} as const;
/** Calculate thrust deduction effective force term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { thrust, deductionFraction } = request;
  const compute = (): Output => {
    H.domain(thrust >= 0);
    H.probability(deductionFraction);
    const deduction = thrust * deductionFraction;
    return { effectiveThrust: thrust - deduction, deduction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { thrust: 1000, deductionFraction: 0.2 },
  output: { effectiveThrust: 800, deduction: 200 },
} satisfies ToolExample<Input, Output>;
export const thrustDeductionEffectiveForceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/thrust-deduction-effective-force-term",
    title: "Thrust Deduction Effective Force Term Tool",
    description:
      "Calculate thrust deduction effective force term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        thrust: { type: "number", minimum: 0 },
        deductionFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["thrust", "deductionFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveThrust: { type: "number" },
        deduction: { type: "number" },
      },
      required: ["effectiveThrust", "deduction"],
    },
    ports: {
      inputs: [
        {
          id: "thrust",
          label: "Thrust",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deductionFraction",
          label: "Deduction Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveThrust",
          label: "Effective Thrust",
          valueType: { type: "number" },
        },
        { id: "deduction", label: "Deduction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = thrustDeductionEffectiveForceTermTool.execute;
export default thrustDeductionEffectiveForceTermTool;
