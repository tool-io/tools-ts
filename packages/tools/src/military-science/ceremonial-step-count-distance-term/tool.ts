import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly steps: number;
  readonly stepLength: number;
  readonly shortenedSteps: number;
  readonly shortenedLength: number;
};
export type Output = { readonly distance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    steps: { type: "integer", minimum: 0 },
    stepLength: { type: "number", minimum: 0 },
    shortenedSteps: { type: "integer", minimum: 0 },
    shortenedLength: { type: "number", minimum: 0 },
  },
  required: ["steps", "stepLength", "shortenedSteps", "shortenedLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" } },
  required: ["distance"],
} as const;
/** Calculate ceremonial step count distance term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { steps, stepLength, shortenedSteps, shortenedLength } = request;
  const compute = (): Output => {
    H.integer(steps, 0);
    H.integer(shortenedSteps, 0, steps);
    H.domain(stepLength >= 0 && shortenedLength >= 0);
    return {
      distance:
        (steps - shortenedSteps) * stepLength +
        shortenedSteps * shortenedLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    steps: 100,
    stepLength: 0.7,
    shortenedSteps: 10,
    shortenedLength: 0.5,
  },
  output: { distance: 68 },
} satisfies ToolExample<Input, Output>;
export const ceremonialStepCountDistanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/ceremonial-step-count-distance-term",
    title: "Ceremonial Step Count Distance Term Tool",
    description:
      "Calculate ceremonial step count distance term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        steps: { type: "integer", minimum: 0 },
        stepLength: { type: "number", minimum: 0 },
        shortenedSteps: { type: "integer", minimum: 0 },
        shortenedLength: { type: "number", minimum: 0 },
      },
      required: ["steps", "stepLength", "shortenedSteps", "shortenedLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { distance: { type: "number" } },
      required: ["distance"],
    },
    ports: {
      inputs: [
        {
          id: "steps",
          label: "Steps",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "stepLength",
          label: "Step Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shortenedSteps",
          label: "Shortened Steps",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "shortenedLength",
          label: "Shortened Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ceremonialStepCountDistanceTermTool.execute;
export default ceremonialStepCountDistanceTermTool;
