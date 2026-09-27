import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly level: number;
  readonly correct: boolean;
  readonly stepUp: number;
  readonly stepDown: number;
  readonly minimum: number;
  readonly maximum: number;
};
export type Output = { readonly unbounded: number; readonly nextLevel: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    level: { type: "number" },
    correct: { type: "boolean" },
    stepUp: { type: "number", exclusiveMinimum: 0 },
    stepDown: { type: "number", exclusiveMinimum: 0 },
    minimum: { type: "number" },
    maximum: { type: "number" },
  },
  required: ["level", "correct", "stepUp", "stepDown", "minimum", "maximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unbounded: { type: "number" }, nextLevel: { type: "number" } },
  required: ["unbounded", "nextLevel"],
} as const;
/** One-up/one-down adaptive level update with explicit bounds; no threshold-convergence claim for unequal steps. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { level, correct, stepUp, stepDown, minimum, maximum } = request;
  const compute = (): Output => {
    H.domain(
      stepUp > 0 &&
        stepDown > 0 &&
        maximum > minimum &&
        level >= minimum &&
        level <= maximum,
    );
    return {
      unbounded: level + (correct ? -stepDown : stepUp),
      nextLevel: Math.max(
        minimum,
        Math.min(maximum, level + (correct ? -stepDown : stepUp)),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    level: 5,
    correct: true,
    stepUp: 2,
    stepDown: 1,
    minimum: 0,
    maximum: 10,
  },
  output: { unbounded: 4, nextLevel: 4 },
} satisfies ToolExample<Input, Output>;
export const staircaseOneUpDownStepResponseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/staircase-one-up-down-step-response",
    title: "Staircase One Up Down Step Response Tool",
    description:
      "One-up/one-down adaptive level update with explicit bounds; no threshold-convergence claim for unequal steps.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        level: { type: "number" },
        correct: { type: "boolean" },
        stepUp: { type: "number", exclusiveMinimum: 0 },
        stepDown: { type: "number", exclusiveMinimum: 0 },
        minimum: { type: "number" },
        maximum: { type: "number" },
      },
      required: [
        "level",
        "correct",
        "stepUp",
        "stepDown",
        "minimum",
        "maximum",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unbounded: { type: "number" },
        nextLevel: { type: "number" },
      },
      required: ["unbounded", "nextLevel"],
    },
    ports: {
      inputs: [
        {
          id: "level",
          label: "Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "correct",
          label: "Correct",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "stepUp",
          label: "Step Up",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stepDown",
          label: "Step Down",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimum",
          label: "Minimum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximum",
          label: "Maximum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "unbounded", label: "Unbounded", valueType: { type: "number" } },
        { id: "nextLevel", label: "Next Level", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = staircaseOneUpDownStepResponseTool.execute;
export default staircaseOneUpDownStepResponseTool;
