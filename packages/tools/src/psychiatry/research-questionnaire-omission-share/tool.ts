import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly answered: number;
  readonly omitted: number;
  readonly inapplicable: number;
  readonly includeInapplicable: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly omissionShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    answered: { type: "integer", minimum: 0 },
    omitted: { type: "integer", minimum: 0 },
    inapplicable: { type: "integer", minimum: 0 },
    includeInapplicable: { type: "boolean" },
  },
  required: ["answered", "omitted", "inapplicable", "includeInapplicable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    omissionShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "omissionShare", "defined"],
} as const;
/** Research form-completion accounting without imputing responses or calculating a psychiatric score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { answered, omitted, inapplicable, includeInapplicable } = request;
  const compute = (): Output => {
    H.integer(answered, 0);
    H.integer(omitted, 0);
    H.integer(inapplicable, 0);
    return {
      denominator:
        answered + omitted + (includeInapplicable ? inapplicable : 0),
      omissionShare:
        answered + omitted + (includeInapplicable ? inapplicable : 0) > 0
          ? omitted /
            (answered + omitted + (includeInapplicable ? inapplicable : 0))
          : 0,
      defined:
        answered + omitted + (includeInapplicable ? inapplicable : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    answered: 8,
    omitted: 2,
    inapplicable: 2,
    includeInapplicable: false,
  },
  output: { denominator: 10, omissionShare: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const researchQuestionnaireOmissionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "psychiatry/research-questionnaire-omission-share",
    title: "Research Questionnaire Omission Share Tool",
    description:
      "Research form-completion accounting without imputing responses or calculating a psychiatric score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        answered: { type: "integer", minimum: 0 },
        omitted: { type: "integer", minimum: 0 },
        inapplicable: { type: "integer", minimum: 0 },
        includeInapplicable: { type: "boolean" },
      },
      required: ["answered", "omitted", "inapplicable", "includeInapplicable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        omissionShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "omissionShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "answered",
          label: "Answered",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "omitted",
          label: "Omitted",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inapplicable",
          label: "Inapplicable",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeInapplicable",
          label: "Include Inapplicable",
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
          id: "omissionShare",
          label: "Omission Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = researchQuestionnaireOmissionShareTool.execute;
export default researchQuestionnaireOmissionShareTool;
