import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participants: number;
  readonly plannedMonths: number;
  readonly unavailablePersonMonths: number;
};
export type Output = {
  readonly plannedPersonMonths: number;
  readonly observedPersonMonths: number;
  readonly exposureFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participants: { type: "integer", minimum: 1 },
    plannedMonths: { type: "number", exclusiveMinimum: 0 },
    unavailablePersonMonths: { type: "number", minimum: 0 },
  },
  required: ["participants", "plannedMonths", "unavailablePersonMonths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedPersonMonths: { type: "number" },
    observedPersonMonths: { type: "number" },
    exposureFraction: { type: "number" },
  },
  required: ["plannedPersonMonths", "observedPersonMonths", "exposureFraction"],
} as const;
/** Calculate policy evaluation time exposure term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participants, plannedMonths, unavailablePersonMonths } = request;
  const compute = (): Output => {
    H.integer(participants, 1);
    H.positive(plannedMonths);
    H.domain(
      unavailablePersonMonths >= 0 &&
        unavailablePersonMonths <= participants * plannedMonths,
    );
    return {
      plannedPersonMonths: participants * plannedMonths,
      observedPersonMonths:
        participants * plannedMonths - unavailablePersonMonths,
      exposureFraction:
        1 - unavailablePersonMonths / (participants * plannedMonths),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { participants: 100, plannedMonths: 12, unavailablePersonMonths: 120 },
  output: {
    plannedPersonMonths: 1200,
    observedPersonMonths: 1080,
    exposureFraction: 0.9,
  },
} satisfies ToolExample<Input, Output>;
export const policyEvaluationTimeExposureTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/policy-evaluation-time-exposure-term",
    title: "Policy Evaluation Time Exposure Term Tool",
    description:
      "Calculate policy evaluation time exposure term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participants: { type: "integer", minimum: 1 },
        plannedMonths: { type: "number", exclusiveMinimum: 0 },
        unavailablePersonMonths: { type: "number", minimum: 0 },
      },
      required: ["participants", "plannedMonths", "unavailablePersonMonths"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedPersonMonths: { type: "number" },
        observedPersonMonths: { type: "number" },
        exposureFraction: { type: "number" },
      },
      required: [
        "plannedPersonMonths",
        "observedPersonMonths",
        "exposureFraction",
      ],
    },
    ports: {
      inputs: [
        {
          id: "participants",
          label: "Participants",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "plannedMonths",
          label: "Planned Months",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unavailablePersonMonths",
          label: "Unavailable Person Months",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "plannedPersonMonths",
          label: "Planned Person Months",
          valueType: { type: "number" },
        },
        {
          id: "observedPersonMonths",
          label: "Observed Person Months",
          valueType: { type: "number" },
        },
        {
          id: "exposureFraction",
          label: "Exposure Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = policyEvaluationTimeExposureTermTool.execute;
export default policyEvaluationTimeExposureTermTool;
