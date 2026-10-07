import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cashContribution: number;
  readonly inKindContribution: number;
  readonly recognitionFraction: number;
};
export type Output = {
  readonly recognizedInKind: number;
  readonly recognizedTotal: number;
  readonly inKindShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashContribution: { type: "number", minimum: 0 },
    inKindContribution: { type: "number", minimum: 0 },
    recognitionFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["cashContribution", "inKindContribution", "recognitionFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recognizedInKind: { type: "number" },
    recognizedTotal: { type: "number" },
    inKindShare: { type: "number" },
  },
  required: ["recognizedInKind", "recognizedTotal", "inKindShare"],
} as const;
/** Apply an explicitly supplied in-kind recognition fraction and describe its share of a positive recognized grant contribution total. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cashContribution, inKindContribution, recognitionFraction } = request;
  const compute = (): Output => {
    H.domain(
      cashContribution >= 0 && inKindContribution >= 0,
      "cashContribution",
    );
    (H.domain(
      recognitionFraction >= 0 && recognitionFraction <= 1,
      "recognitionFraction",
    ),
      recognitionFraction);
    return (() => {
      const recognizedInKind = inKindContribution * recognitionFraction,
        recognizedTotal = cashContribution + recognizedInKind;
      H.domain(recognizedTotal > 0, "cashContribution");
      return {
        recognizedInKind,
        recognizedTotal,
        inKindShare: recognizedInKind / recognizedTotal,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cashContribution: 1000,
    inKindContribution: 500,
    recognitionFraction: 0.8,
  },
  output: {
    recognizedInKind: 400,
    recognizedTotal: 1400,
    inKindShare: 0.2857142857142857,
  },
} satisfies ToolExample<Input, Output>;
export const communityGrantRecognizedInKindShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "community-development",
          "community development",
          "social sciences",
        ],
        keywords: ["community development", "social sciences"],
      },
      id: "community-development/community-grant-recognized-in-kind-share",
      title: "Community Grant Recognized In Kind Share",
      description:
        "Apply an explicitly supplied in-kind recognition fraction and describe its share of a positive recognized grant contribution total.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cashContribution: { type: "number", minimum: 0 },
          inKindContribution: { type: "number", minimum: 0 },
          recognitionFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "cashContribution",
          "inKindContribution",
          "recognitionFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recognizedInKind: { type: "number" },
          recognizedTotal: { type: "number" },
          inKindShare: { type: "number" },
        },
        required: ["recognizedInKind", "recognizedTotal", "inKindShare"],
      },
      ports: {
        inputs: [
          {
            id: "cashContribution",
            label: "Cash Contribution",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inKindContribution",
            label: "In Kind Contribution",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recognitionFraction",
            label: "Recognition Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "recognizedInKind",
            label: "Recognized In Kind",
            valueType: { type: "number" },
          },
          {
            id: "recognizedTotal",
            label: "Recognized Total",
            valueType: { type: "number" },
          },
          {
            id: "inKindShare",
            label: "In Kind Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = communityGrantRecognizedInKindShareTool.execute;
export default communityGrantRecognizedInKindShareTool;
