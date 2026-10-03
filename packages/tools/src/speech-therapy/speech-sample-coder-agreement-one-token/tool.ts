import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly string[];
  readonly second: readonly string[];
  readonly missingToken: string;
};
export type Output = {
  readonly eligible: number;
  readonly agreements: number;
  readonly disagreements: readonly number[];
  readonly agreement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    second: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingToken: { type: "string", maxLength: 8192 },
  },
  required: ["first", "second", "missingToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligible: { type: "integer" },
    agreements: { type: "integer" },
    disagreements: { type: "array", maxItems: 256, items: { type: "integer" } },
    agreement: { type: "number" },
  },
  required: ["eligible", "agreements", "disagreements", "agreement"],
} as const;
/** Compare supplied coder tokens after pairwise missing-token exclusion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, missingToken } = request;
  const compute = (): Output => {
    H.sameLength(first, second);
    const indices = first.flatMap((x, i) =>
      x !== missingToken && second[i] !== missingToken ? [i] : [],
    );
    H.domain(indices.length > 0, "first");
    const disagreements = indices.filter((i) => first[i] !== second[i]);
    return {
      eligible: indices.length,
      agreements: indices.length - disagreements.length,
      disagreements,
      agreement: (indices.length - disagreements.length) / indices.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    first: ["A", "B", "NA", "C"],
    second: ["A", "C", "A", "C"],
    missingToken: "NA",
  },
  output: {
    eligible: 3,
    agreements: 2,
    disagreements: [1],
    agreement: 0.6666666666666666,
  },
} satisfies ToolExample<Input, Output>;
export const speechSampleCoderAgreementOneTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "speech-therapy/speech-sample-coder-agreement-one-token",
    title: "Speech Sample Coder Agreement One Token Tool",
    description:
      "Compare supplied coder tokens after pairwise missing-token exclusion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        second: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        missingToken: { type: "string", maxLength: 8192 },
      },
      required: ["first", "second", "missingToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligible: { type: "integer" },
        agreements: { type: "integer" },
        disagreements: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        agreement: { type: "number" },
      },
      required: ["eligible", "agreements", "disagreements", "agreement"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "missingToken",
          label: "Missing Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "eligible", label: "Eligible", valueType: { type: "integer" } },
        {
          id: "agreements",
          label: "Agreements",
          valueType: { type: "integer" },
        },
        {
          id: "disagreements",
          label: "Disagreements",
          valueType: { type: "list", items: { type: "integer" } },
        },
        { id: "agreement", label: "Agreement", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = speechSampleCoderAgreementOneTokenTool.execute;
export default speechSampleCoderAgreementOneTokenTool;
