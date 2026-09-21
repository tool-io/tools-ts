import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedFraction: number;
  readonly dryMatterFraction: number;
  readonly referenceFraction: number;
  readonly sourceIsDryBasis: boolean;
  readonly referenceIsDryBasis: boolean;
};
export type Output = {
  readonly sourceWetFraction: number;
  readonly referenceWetFraction: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedFraction: { type: "number", minimum: 0, maximum: 1 },
    dryMatterFraction: { type: "number", minimum: 0, maximum: 1 },
    referenceFraction: { type: "number", minimum: 0, maximum: 1 },
    sourceIsDryBasis: { type: "boolean" },
    referenceIsDryBasis: { type: "boolean" },
  },
  required: [
    "reportedFraction",
    "dryMatterFraction",
    "referenceFraction",
    "sourceIsDryBasis",
    "referenceIsDryBasis",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceWetFraction: { type: "number" },
    referenceWetFraction: { type: "number" },
    gap: { type: "number" },
  },
  required: ["sourceWetFraction", "referenceWetFraction", "gap"],
} as const;
/** Calculate nutrient reporting basis gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    reportedFraction,
    dryMatterFraction,
    referenceFraction,
    sourceIsDryBasis,
    referenceIsDryBasis,
  } = request;
  const compute = (): Output => {
    H.probability(reportedFraction);
    H.probability(dryMatterFraction);
    H.probability(referenceFraction);
    return (() => {
      const sourceWetFraction =
          reportedFraction * (sourceIsDryBasis ? dryMatterFraction : 1),
        referenceWetFraction =
          referenceFraction * (referenceIsDryBasis ? dryMatterFraction : 1);
      return {
        sourceWetFraction,
        referenceWetFraction,
        gap: sourceWetFraction - referenceWetFraction,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reportedFraction: 0.2,
    dryMatterFraction: 0.5,
    referenceFraction: 0.1,
    sourceIsDryBasis: true,
    referenceIsDryBasis: false,
  },
  output: { sourceWetFraction: 0.1, referenceWetFraction: 0.1, gap: 0 },
} satisfies ToolExample<Input, Output>;
export const nutrientReportingBasisGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrochemistry/nutrient-reporting-basis-gap",
    title: "Nutrient Reporting Basis Gap Tool",
    description:
      "Calculate nutrient reporting basis gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedFraction: { type: "number", minimum: 0, maximum: 1 },
        dryMatterFraction: { type: "number", minimum: 0, maximum: 1 },
        referenceFraction: { type: "number", minimum: 0, maximum: 1 },
        sourceIsDryBasis: { type: "boolean" },
        referenceIsDryBasis: { type: "boolean" },
      },
      required: [
        "reportedFraction",
        "dryMatterFraction",
        "referenceFraction",
        "sourceIsDryBasis",
        "referenceIsDryBasis",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceWetFraction: { type: "number" },
        referenceWetFraction: { type: "number" },
        gap: { type: "number" },
      },
      required: ["sourceWetFraction", "referenceWetFraction", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "reportedFraction",
          label: "Reported Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryMatterFraction",
          label: "Dry Matter Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceFraction",
          label: "Reference Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceIsDryBasis",
          label: "Source Is Dry Basis",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "referenceIsDryBasis",
          label: "Reference Is Dry Basis",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "sourceWetFraction",
          label: "Source Wet Fraction",
          valueType: { type: "number" },
        },
        {
          id: "referenceWetFraction",
          label: "Reference Wet Fraction",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = nutrientReportingBasisGapTool.execute;
export default nutrientReportingBasisGapTool;
