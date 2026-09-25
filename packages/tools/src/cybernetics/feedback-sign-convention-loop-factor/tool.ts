import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly loopGain: number;
  readonly positiveFeedback: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly closedLoopGain: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loopGain: { type: "number" },
    positiveFeedback: { type: "boolean" },
  },
  required: ["loopGain", "positiveFeedback"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "number" },
    closedLoopGain: { type: "number" },
  },
  required: ["denominator", "closedLoopGain"],
} as const;
/** Calculate feedback sign convention loop factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { loopGain, positiveFeedback } = request;
  const compute = (): Output => {
    H.domain(1 + (positiveFeedback ? -loopGain : loopGain) !== 0);
    return {
      denominator: 1 + (positiveFeedback ? -loopGain : loopGain),
      closedLoopGain:
        loopGain / (1 + (positiveFeedback ? -loopGain : loopGain)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { loopGain: 2, positiveFeedback: false },
  output: { denominator: 3, closedLoopGain: 0.6666666666666666 },
} satisfies ToolExample<Input, Output>;
export const feedbackSignConventionLoopFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/feedback-sign-convention-loop-factor",
    title: "Feedback Sign Convention Loop Factor Tool",
    description:
      "Calculate feedback sign convention loop factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loopGain: { type: "number" },
        positiveFeedback: { type: "boolean" },
      },
      required: ["loopGain", "positiveFeedback"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "number" },
        closedLoopGain: { type: "number" },
      },
      required: ["denominator", "closedLoopGain"],
    },
    ports: {
      inputs: [
        {
          id: "loopGain",
          label: "Loop Gain",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveFeedback",
          label: "Positive Feedback",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
        {
          id: "closedLoopGain",
          label: "Closed Loop Gain",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = feedbackSignConventionLoopFactorTool.execute;
export default feedbackSignConventionLoopFactorTool;
