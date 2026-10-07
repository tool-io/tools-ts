import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstDoi: string; readonly secondDoi: string };
export type Output = {
  readonly sameName: boolean;
  readonly firstNormalized: string;
  readonly secondNormalized: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDoi: { type: "string", maxLength: 8192 },
    secondDoi: { type: "string", maxLength: 8192 },
  },
  required: ["firstDoi", "secondDoi"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameName: { type: "boolean" },
    firstNormalized: { type: "string", maxLength: 8192 },
    secondNormalized: { type: "string", maxLength: 8192 },
  },
  required: ["sameName", "firstNormalized", "secondNormalized"],
} as const;
/** Compare explicit ASCII DOI name strings case-insensitively; resolver URLs, whitespace and registry-existence checks are outside this input grammar. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDoi, secondDoi } = request;
  const compute = (): Output => {
    for (const [field, value] of [
      ["firstDoi", firstDoi],
      ["secondDoi", secondDoi],
    ])
      H.domain(/^10\.\d+\/[\x21-\x7e]+(?![\s\S])/.test(value), field);
    const firstNormalized = firstDoi.toLowerCase(),
      secondNormalized = secondDoi.toLowerCase();
    return {
      sameName: firstNormalized === secondNormalized,
      firstNormalized,
      secondNormalized,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDoi: "10.1000/ABC", secondDoi: "10.1000/abc" },
  output: {
    sameName: true,
    firstNormalized: "10.1000/abc",
    secondNormalized: "10.1000/abc",
  },
} satisfies ToolExample<Input, Output>;
export const doiCasefoldComparisonTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["bibliometrics", "research and quality management"],
      keywords: ["bibliometrics", "research and quality management"],
    },
    id: "bibliometrics/doi-casefold-comparison",
    title: "DOI Casefold Comparison",
    description:
      "Compare explicit ASCII DOI name strings case-insensitively; resolver URLs, whitespace and registry-existence checks are outside this input grammar.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDoi: { type: "string", maxLength: 8192 },
        secondDoi: { type: "string", maxLength: 8192 },
      },
      required: ["firstDoi", "secondDoi"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameName: { type: "boolean" },
        firstNormalized: { type: "string", maxLength: 8192 },
        secondNormalized: { type: "string", maxLength: 8192 },
      },
      required: ["sameName", "firstNormalized", "secondNormalized"],
    },
    ports: {
      inputs: [
        {
          id: "firstDoi",
          label: "First Doi",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondDoi",
          label: "Second Doi",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "sameName", label: "Same Name", valueType: { type: "boolean" } },
        {
          id: "firstNormalized",
          label: "First Normalized",
          valueType: { type: "string" },
        },
        {
          id: "secondNormalized",
          label: "Second Normalized",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = doiCasefoldComparisonTool.execute;
export default doiCasefoldComparisonTool;
