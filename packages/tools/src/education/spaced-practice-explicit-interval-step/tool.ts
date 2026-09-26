import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousInterval: number;
  readonly multiplier: number;
  readonly minimum: number;
  readonly maximum: number;
};
export type Output = { readonly nextInterval: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousInterval: { type: "number", minimum: 0 },
    multiplier: { type: "number", minimum: 0 },
    minimum: { type: "number", minimum: 0 },
    maximum: { type: "number" },
  },
  required: ["previousInterval", "multiplier", "minimum", "maximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nextInterval: { type: "number" } },
  required: ["nextInterval"],
} as const;
/** Apply an explicit bounded interval multiplier without choosing a learning schedule or efficacy model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousInterval, multiplier, minimum, maximum } = request;
  const compute = (): Output => {
    H.domain(
      previousInterval >= 0 &&
        multiplier >= 0 &&
        minimum >= 0 &&
        maximum >= minimum,
    );
    return {
      nextInterval: Math.max(
        minimum,
        Math.min(maximum, previousInterval * multiplier),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousInterval: 3, multiplier: 2, minimum: 1, maximum: 10 },
  output: { nextInterval: 6 },
} satisfies ToolExample<Input, Output>;
export const spacedPracticeExplicitIntervalStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/spaced-practice-explicit-interval-step",
    title: "Spaced Practice Explicit Interval Step Tool",
    description:
      "Apply an explicit bounded interval multiplier without choosing a learning schedule or efficacy model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousInterval: { type: "number", minimum: 0 },
        multiplier: { type: "number", minimum: 0 },
        minimum: { type: "number", minimum: 0 },
        maximum: { type: "number" },
      },
      required: ["previousInterval", "multiplier", "minimum", "maximum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { nextInterval: { type: "number" } },
      required: ["nextInterval"],
    },
    ports: {
      inputs: [
        {
          id: "previousInterval",
          label: "Previous Interval",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "multiplier",
          label: "Multiplier",
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
        {
          id: "nextInterval",
          label: "Next Interval",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = spacedPracticeExplicitIntervalStepTool.execute;
export default spacedPracticeExplicitIntervalStepTool;
