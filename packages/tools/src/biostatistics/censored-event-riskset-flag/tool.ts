import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entry: number;
  readonly exit: number;
  readonly eventAtExit: boolean;
  readonly evaluationTime: number;
  readonly evaluateBeforeEvents: boolean;
};
export type Output = {
  readonly inRiskSet: boolean;
  readonly eventAtEvaluation: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entry: { type: "number" },
    exit: { type: "number" },
    eventAtExit: { type: "boolean" },
    evaluationTime: { type: "number" },
    evaluateBeforeEvents: { type: "boolean" },
  },
  required: [
    "entry",
    "exit",
    "eventAtExit",
    "evaluationTime",
    "evaluateBeforeEvents",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inRiskSet: { type: "boolean" },
    eventAtEvaluation: { type: "boolean" },
  },
  required: ["inRiskSet", "eventAtEvaluation"],
} as const;
/** Inspect an explicit at-risk interval with supplied pre/post-exit evaluation policy; event and censoring are distinct flags. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entry, exit, eventAtExit, evaluationTime, evaluateBeforeEvents } =
    request;
  const compute = (): Output => {
    H.domain(exit >= entry);
    return {
      inRiskSet:
        evaluationTime >= entry &&
        (evaluateBeforeEvents ? evaluationTime <= exit : evaluationTime < exit),
      eventAtEvaluation: eventAtExit && evaluationTime === exit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    entry: 0,
    exit: 10,
    eventAtExit: true,
    evaluationTime: 10,
    evaluateBeforeEvents: true,
  },
  output: { inRiskSet: true, eventAtEvaluation: true },
} satisfies ToolExample<Input, Output>;
export const censoredEventRisksetFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biostatistics/censored-event-riskset-flag",
    title: "Censored Event Riskset Flag Tool",
    description:
      "Inspect an explicit at-risk interval with supplied pre/post-exit evaluation policy; event and censoring are distinct flags.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entry: { type: "number" },
        exit: { type: "number" },
        eventAtExit: { type: "boolean" },
        evaluationTime: { type: "number" },
        evaluateBeforeEvents: { type: "boolean" },
      },
      required: [
        "entry",
        "exit",
        "eventAtExit",
        "evaluationTime",
        "evaluateBeforeEvents",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inRiskSet: { type: "boolean" },
        eventAtEvaluation: { type: "boolean" },
      },
      required: ["inRiskSet", "eventAtEvaluation"],
    },
    ports: {
      inputs: [
        {
          id: "entry",
          label: "Entry",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exit",
          label: "Exit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eventAtExit",
          label: "Event At Exit",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "evaluationTime",
          label: "Evaluation Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "evaluateBeforeEvents",
          label: "Evaluate Before Events",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "inRiskSet",
          label: "In Risk Set",
          valueType: { type: "boolean" },
        },
        {
          id: "eventAtEvaluation",
          label: "Event At Evaluation",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = censoredEventRisksetFlagTool.execute;
export default censoredEventRisksetFlagTool;
