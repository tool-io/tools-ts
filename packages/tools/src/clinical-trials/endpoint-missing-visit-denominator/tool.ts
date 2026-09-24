import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduled: number;
  readonly attended: number;
  readonly evaluable: number;
  readonly useScheduled: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly missingVisits: number;
  readonly unevaluableVisits: number;
  readonly evaluableShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduled: { type: "integer", minimum: 0 },
    attended: { type: "integer", minimum: 0 },
    evaluable: { type: "integer", minimum: 0 },
    useScheduled: { type: "boolean" },
  },
  required: ["scheduled", "attended", "evaluable", "useScheduled"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    missingVisits: { type: "integer" },
    unevaluableVisits: { type: "integer" },
    evaluableShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "denominator",
    "missingVisits",
    "unevaluableVisits",
    "evaluableShare",
    "defined",
  ],
} as const;
/** Calculate endpoint missing visit denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduled, attended, evaluable, useScheduled } = request;
  const compute = (): Output => {
    H.integer(scheduled, 0);
    H.integer(attended, 0, scheduled);
    H.integer(evaluable, 0, attended);
    return {
      denominator: useScheduled ? scheduled : attended,
      missingVisits: scheduled - attended,
      unevaluableVisits: attended - evaluable,
      evaluableShare:
        (useScheduled ? scheduled : attended) > 0
          ? evaluable / (useScheduled ? scheduled : attended)
          : 0,
      defined: (useScheduled ? scheduled : attended) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scheduled: 100, attended: 80, evaluable: 60, useScheduled: true },
  output: {
    denominator: 100,
    missingVisits: 20,
    unevaluableVisits: 20,
    evaluableShare: 0.6,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const endpointMissingVisitDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/endpoint-missing-visit-denominator",
    title: "Endpoint Missing Visit Denominator Tool",
    description:
      "Calculate endpoint missing visit denominator from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduled: { type: "integer", minimum: 0 },
        attended: { type: "integer", minimum: 0 },
        evaluable: { type: "integer", minimum: 0 },
        useScheduled: { type: "boolean" },
      },
      required: ["scheduled", "attended", "evaluable", "useScheduled"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        missingVisits: { type: "integer" },
        unevaluableVisits: { type: "integer" },
        evaluableShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "denominator",
        "missingVisits",
        "unevaluableVisits",
        "evaluableShare",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "scheduled",
          label: "Scheduled",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "attended",
          label: "Attended",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "evaluable",
          label: "Evaluable",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "useScheduled",
          label: "Use Scheduled",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "missingVisits",
          label: "Missing Visits",
          valueType: { type: "integer" },
        },
        {
          id: "unevaluableVisits",
          label: "Unevaluable Visits",
          valueType: { type: "integer" },
        },
        {
          id: "evaluableShare",
          label: "Evaluable Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = endpointMissingVisitDenominatorTool.execute;
export default endpointMissingVisitDenominatorTool;
