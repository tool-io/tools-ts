import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly enrolled: number;
  readonly assessed: number;
  readonly responseCount: number;
  readonly includeMissing: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly missing: number;
  readonly fractionDefined: boolean;
  readonly responseFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    enrolled: { type: "integer", minimum: 0 },
    assessed: { type: "integer", minimum: 0 },
    responseCount: { type: "integer", minimum: 0 },
    includeMissing: { type: "boolean" },
  },
  required: ["enrolled", "assessed", "responseCount", "includeMissing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    missing: { type: "integer" },
    fractionDefined: { type: "boolean" },
    responseFraction: { type: "number" },
  },
  required: ["denominator", "missing", "fractionDefined", "responseFraction"],
} as const;
/** Audit denominators for independently coded study responses, without defining response criteria. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { enrolled, assessed, responseCount, includeMissing } = request;
  const compute = (): Output => {
    H.integer(enrolled, 0);
    H.integer(assessed, 0, enrolled);
    H.integer(responseCount, 0, assessed);
    return {
      denominator: includeMissing ? enrolled : assessed,
      missing: enrolled - assessed,
      fractionDefined: (includeMissing ? enrolled : assessed) > 0,
      responseFraction:
        (includeMissing ? enrolled : assessed) > 0
          ? responseCount / (includeMissing ? enrolled : assessed)
          : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    enrolled: 100,
    assessed: 80,
    responseCount: 40,
    includeMissing: true,
  },
  output: {
    denominator: 100,
    missing: 20,
    fractionDefined: true,
    responseFraction: 0.4,
  },
} satisfies ToolExample<Input, Output>;
export const studyResponseMissingAssessmentBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oncology/study-response-missing-assessment-base",
    title: "Study Response Missing Assessment Base Tool",
    description:
      "Audit denominators for independently coded study responses, without defining response criteria.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        enrolled: { type: "integer", minimum: 0 },
        assessed: { type: "integer", minimum: 0 },
        responseCount: { type: "integer", minimum: 0 },
        includeMissing: { type: "boolean" },
      },
      required: ["enrolled", "assessed", "responseCount", "includeMissing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        missing: { type: "integer" },
        fractionDefined: { type: "boolean" },
        responseFraction: { type: "number" },
      },
      required: [
        "denominator",
        "missing",
        "fractionDefined",
        "responseFraction",
      ],
    },
    ports: {
      inputs: [
        {
          id: "enrolled",
          label: "Enrolled",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "assessed",
          label: "Assessed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "responseCount",
          label: "Response Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeMissing",
          label: "Include Missing",
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
        { id: "missing", label: "Missing", valueType: { type: "integer" } },
        {
          id: "fractionDefined",
          label: "Fraction Defined",
          valueType: { type: "boolean" },
        },
        {
          id: "responseFraction",
          label: "Response Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = studyResponseMissingAssessmentBaseTool.execute;
export default studyResponseMissingAssessmentBaseTool;
