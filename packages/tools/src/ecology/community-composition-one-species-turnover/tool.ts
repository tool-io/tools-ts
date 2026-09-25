import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAbundance: number;
  readonly secondAbundance: number;
  readonly firstTotal: number;
  readonly secondTotal: number;
};
export type Output = {
  readonly firstShare: number;
  readonly secondShare: number;
  readonly brayCurtisNumeratorTerm: number;
  readonly relativeChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAbundance: { type: "number", minimum: 0 },
    secondAbundance: { type: "number", minimum: 0 },
    firstTotal: { type: "number", exclusiveMinimum: 0 },
    secondTotal: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstAbundance", "secondAbundance", "firstTotal", "secondTotal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstShare: { type: "number" },
    secondShare: { type: "number" },
    brayCurtisNumeratorTerm: { type: "number" },
    relativeChange: { type: "number" },
  },
  required: [
    "firstShare",
    "secondShare",
    "brayCurtisNumeratorTerm",
    "relativeChange",
  ],
} as const;
/** One species share change and raw Bray-Curtis numerator contribution, not a whole-community dissimilarity index. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAbundance, secondAbundance, firstTotal, secondTotal } = request;
  const compute = (): Output => {
    H.positive(firstTotal);
    H.positive(secondTotal);
    H.domain(
      firstAbundance >= 0 &&
        firstAbundance <= firstTotal &&
        secondAbundance >= 0 &&
        secondAbundance <= secondTotal,
    );
    return {
      firstShare: firstAbundance / firstTotal,
      secondShare: secondAbundance / secondTotal,
      brayCurtisNumeratorTerm: Math.abs(firstAbundance - secondAbundance),
      relativeChange:
        secondAbundance / secondTotal - firstAbundance / firstTotal,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstAbundance: 20,
    secondAbundance: 30,
    firstTotal: 100,
    secondTotal: 150,
  },
  output: {
    firstShare: 0.2,
    secondShare: 0.2,
    brayCurtisNumeratorTerm: 10,
    relativeChange: 0,
  },
} satisfies ToolExample<Input, Output>;
export const communityCompositionOneSpeciesTurnoverTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ecology/community-composition-one-species-turnover",
      title: "Community Composition One Species Turnover Tool",
      description:
        "One species share change and raw Bray-Curtis numerator contribution, not a whole-community dissimilarity index.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstAbundance: { type: "number", minimum: 0 },
          secondAbundance: { type: "number", minimum: 0 },
          firstTotal: { type: "number", exclusiveMinimum: 0 },
          secondTotal: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "firstAbundance",
          "secondAbundance",
          "firstTotal",
          "secondTotal",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstShare: { type: "number" },
          secondShare: { type: "number" },
          brayCurtisNumeratorTerm: { type: "number" },
          relativeChange: { type: "number" },
        },
        required: [
          "firstShare",
          "secondShare",
          "brayCurtisNumeratorTerm",
          "relativeChange",
        ],
      },
      ports: {
        inputs: [
          {
            id: "firstAbundance",
            label: "First Abundance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondAbundance",
            label: "Second Abundance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstTotal",
            label: "First Total",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondTotal",
            label: "Second Total",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "firstShare",
            label: "First Share",
            valueType: { type: "number" },
          },
          {
            id: "secondShare",
            label: "Second Share",
            valueType: { type: "number" },
          },
          {
            id: "brayCurtisNumeratorTerm",
            label: "Bray Curtis Numerator Term",
            valueType: { type: "number" },
          },
          {
            id: "relativeChange",
            label: "Relative Change",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = communityCompositionOneSpeciesTurnoverTool.execute;
export default communityCompositionOneSpeciesTurnoverTool;
