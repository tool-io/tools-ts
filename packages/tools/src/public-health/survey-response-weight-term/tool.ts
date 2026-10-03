import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseValue: number;
  readonly designWeight: number;
  readonly nonresponseFactor: number;
  readonly suppliedScheme: string;
};
export type Output = {
  readonly weightedContribution: number;
  readonly finalWeight: number;
  readonly scheme: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseValue: { type: "number" },
    designWeight: { type: "number", minimum: 0 },
    nonresponseFactor: { type: "number", minimum: 0 },
    suppliedScheme: { type: "string", maxLength: 8192 },
  },
  required: [
    "responseValue",
    "designWeight",
    "nonresponseFactor",
    "suppliedScheme",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedContribution: { type: "number" },
    finalWeight: { type: "number" },
    scheme: { type: "string", maxLength: 8192 },
  },
  required: ["weightedContribution", "finalWeight", "scheme"],
} as const;
/** Return one supplied survey design/nonresponse-weight contribution under an explicit caller-verified scheme; no automatic area weights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseValue, designWeight, nonresponseFactor, suppliedScheme } =
    request;
  const compute = (): Output => {
    H.domain(
      designWeight >= 0 && nonresponseFactor >= 0 && suppliedScheme.length > 0,
    );
    return {
      weightedContribution: responseValue * designWeight * nonresponseFactor,
      finalWeight: designWeight * nonresponseFactor,
      scheme: suppliedScheme,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    responseValue: 2,
    designWeight: 3,
    nonresponseFactor: 1.5,
    suppliedScheme: "verified-scheme-A",
  },
  output: {
    weightedContribution: 9,
    finalWeight: 4.5,
    scheme: "verified-scheme-A",
  },
} satisfies ToolExample<Input, Output>;
export const surveyResponseWeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-health/survey-response-weight-term",
    title: "Survey Response Weight Term Tool",
    description:
      "Return one supplied survey design/nonresponse-weight contribution under an explicit caller-verified scheme; no automatic area weights.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseValue: { type: "number" },
        designWeight: { type: "number", minimum: 0 },
        nonresponseFactor: { type: "number", minimum: 0 },
        suppliedScheme: { type: "string", maxLength: 8192 },
      },
      required: [
        "responseValue",
        "designWeight",
        "nonresponseFactor",
        "suppliedScheme",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedContribution: { type: "number" },
        finalWeight: { type: "number" },
        scheme: { type: "string", maxLength: 8192 },
      },
      required: ["weightedContribution", "finalWeight", "scheme"],
    },
    ports: {
      inputs: [
        {
          id: "responseValue",
          label: "Response Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "designWeight",
          label: "Design Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nonresponseFactor",
          label: "Nonresponse Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScheme",
          label: "Supplied Scheme",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "weightedContribution",
          label: "Weighted Contribution",
          valueType: { type: "number" },
        },
        {
          id: "finalWeight",
          label: "Final Weight",
          valueType: { type: "number" },
        },
        { id: "scheme", label: "Scheme", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = surveyResponseWeightTermTool.execute;
export default surveyResponseWeightTermTool;
