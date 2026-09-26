import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalMinutes: number;
  readonly transitionMinutes: number;
};
export type Output = {
  readonly instructionMinutes: number;
  readonly lossFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMinutes: { type: "number", exclusiveMinimum: 0 },
    transitionMinutes: { type: "number", minimum: 0 },
  },
  required: ["totalMinutes", "transitionMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    instructionMinutes: { type: "number" },
    lossFraction: { type: "number" },
  },
  required: ["instructionMinutes", "lossFraction"],
} as const;
/** Calculate instructional time transition loss fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalMinutes, transitionMinutes } = request;
  const compute = (): Output => {
    H.positive(totalMinutes);
    H.domain(transitionMinutes >= 0 && transitionMinutes <= totalMinutes);
    return {
      instructionMinutes: totalMinutes - transitionMinutes,
      lossFraction: transitionMinutes / totalMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalMinutes: 60, transitionMinutes: 9 },
  output: { instructionMinutes: 51, lossFraction: 0.15 },
} satisfies ToolExample<Input, Output>;
export const instructionalTimeTransitionLossFractionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "education/instructional-time-transition-loss-fraction",
      title: "Instructional Time Transition Loss Fraction Tool",
      description:
        "Calculate instructional time transition loss fraction from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalMinutes: { type: "number", exclusiveMinimum: 0 },
          transitionMinutes: { type: "number", minimum: 0 },
        },
        required: ["totalMinutes", "transitionMinutes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          instructionMinutes: { type: "number" },
          lossFraction: { type: "number" },
        },
        required: ["instructionMinutes", "lossFraction"],
      },
      ports: {
        inputs: [
          {
            id: "totalMinutes",
            label: "Total Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "transitionMinutes",
            label: "Transition Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "instructionMinutes",
            label: "Instruction Minutes",
            valueType: { type: "number" },
          },
          {
            id: "lossFraction",
            label: "Loss Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = instructionalTimeTransitionLossFractionTool.execute;
export default instructionalTimeTransitionLossFractionTool;
