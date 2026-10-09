import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly experimentId: string;
  readonly observed: boolean;
  readonly reviewed: boolean;
  readonly supportsHypothesis: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    experimentId: { type: "string", maxLength: 8192, minLength: 1 },
    observed: { type: "boolean" },
    reviewed: { type: "boolean" },
    supportsHypothesis: { type: "boolean" },
  },
  required: ["experimentId", "observed", "reviewed", "supportsHypothesis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicit experiment observation and review flags without judging scientific evidence or product viability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { experimentId, observed, reviewed, supportsHypothesis } = request;
  const compute = (): Output => {
    H.domain(experimentId.length > 0, "experimentId");
    H.domain(!reviewed || observed, "reviewed");
    H.domain(!supportsHypothesis || reviewed, "supportsHypothesis");
    return {
      label:
        experimentId +
        " [" +
        (!observed
          ? "not observed"
          : !reviewed
            ? "awaiting review"
            : supportsHypothesis
              ? "reported support"
              : "no reported support") +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    experimentId: "EXP17",
    observed: true,
    reviewed: true,
    supportsHypothesis: false,
  },
  output: { label: "EXP17 [no reported support]" },
} satisfies ToolExample<Input, Output>;
export const startupExperimentEvidenceStatusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "entrepreneurship-studies",
        "entrepreneurship studies",
        "business and finance",
      ],
      keywords: ["entrepreneurship studies", "business and finance"],
    },
    id: "entrepreneurship-studies/startup-experiment-evidence-status",
    title: "Startup Experiment Evidence Status",
    description:
      "Label explicit experiment observation and review flags without judging scientific evidence or product viability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        experimentId: { type: "string", maxLength: 8192, minLength: 1 },
        observed: { type: "boolean" },
        reviewed: { type: "boolean" },
        supportsHypothesis: { type: "boolean" },
      },
      required: ["experimentId", "observed", "reviewed", "supportsHypothesis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "experimentId",
          label: "Experiment Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "reviewed",
          label: "Reviewed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "supportsHypothesis",
          label: "Supports Hypothesis",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = startupExperimentEvidenceStatusTool.execute;
export default startupExperimentEvidenceStatusTool;
