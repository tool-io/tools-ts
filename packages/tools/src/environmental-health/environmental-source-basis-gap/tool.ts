import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedConcentration: number;
  readonly sourceBasisFactor: number;
  readonly referenceBasisFactor: number;
  readonly suppliedReferenceValue: number;
};
export type Output = {
  readonly commonBasisValue: number;
  readonly referenceBasisValue: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedConcentration: { type: "number" },
    sourceBasisFactor: { type: "number", exclusiveMinimum: 0 },
    referenceBasisFactor: { type: "number", exclusiveMinimum: 0 },
    suppliedReferenceValue: { type: "number" },
  },
  required: [
    "reportedConcentration",
    "sourceBasisFactor",
    "referenceBasisFactor",
    "suppliedReferenceValue",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commonBasisValue: { type: "number" },
    referenceBasisValue: { type: "number" },
    gap: { type: "number" },
  },
  required: ["commonBasisValue", "referenceBasisValue", "gap"],
} as const;
/** Compare bench concentrations on explicit caller-supplied reporting bases without exposure limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    reportedConcentration,
    sourceBasisFactor,
    referenceBasisFactor,
    suppliedReferenceValue,
  } = request;
  const compute = (): Output => {
    H.positive(sourceBasisFactor);
    H.positive(referenceBasisFactor);
    return {
      commonBasisValue: reportedConcentration * sourceBasisFactor,
      referenceBasisValue: suppliedReferenceValue * referenceBasisFactor,
      gap:
        reportedConcentration * sourceBasisFactor -
        suppliedReferenceValue * referenceBasisFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reportedConcentration: 2,
    sourceBasisFactor: 3,
    referenceBasisFactor: 2,
    suppliedReferenceValue: 2,
  },
  output: { commonBasisValue: 6, referenceBasisValue: 4, gap: 2 },
} satisfies ToolExample<Input, Output>;
export const environmentalSourceBasisGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-health/environmental-source-basis-gap",
    title: "Environmental Source Basis Gap Tool",
    description:
      "Compare bench concentrations on explicit caller-supplied reporting bases without exposure limits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedConcentration: { type: "number" },
        sourceBasisFactor: { type: "number", exclusiveMinimum: 0 },
        referenceBasisFactor: { type: "number", exclusiveMinimum: 0 },
        suppliedReferenceValue: { type: "number" },
      },
      required: [
        "reportedConcentration",
        "sourceBasisFactor",
        "referenceBasisFactor",
        "suppliedReferenceValue",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commonBasisValue: { type: "number" },
        referenceBasisValue: { type: "number" },
        gap: { type: "number" },
      },
      required: ["commonBasisValue", "referenceBasisValue", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "reportedConcentration",
          label: "Reported Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceBasisFactor",
          label: "Source Basis Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceBasisFactor",
          label: "Reference Basis Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferenceValue",
          label: "Supplied Reference Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "commonBasisValue",
          label: "Common Basis Value",
          valueType: { type: "number" },
        },
        {
          id: "referenceBasisValue",
          label: "Reference Basis Value",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = environmentalSourceBasisGapTool.execute;
export default environmentalSourceBasisGapTool;
