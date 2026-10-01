import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly artifactLength: number;
  readonly modelLength: number;
  readonly declaredScaleDenominator: number;
};
export type Output = {
  readonly impliedScaleDenominator: number;
  readonly denominatorGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    artifactLength: { type: "number", exclusiveMinimum: 0 },
    modelLength: { type: "number", exclusiveMinimum: 0 },
    declaredScaleDenominator: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["artifactLength", "modelLength", "declaredScaleDenominator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    impliedScaleDenominator: { type: "number" },
    denominatorGap: { type: "number" },
  },
  required: ["impliedScaleDenominator", "denominatorGap"],
} as const;
/** Check a public museum model’s explicit scale dimensions, without operational equipment guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { artifactLength, modelLength, declaredScaleDenominator } = request;
  const compute = (): Output => {
    H.positive(artifactLength);
    H.positive(modelLength);
    H.positive(declaredScaleDenominator);
    return {
      impliedScaleDenominator: artifactLength / modelLength,
      denominatorGap: artifactLength / modelLength - declaredScaleDenominator,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { artifactLength: 120, modelLength: 2, declaredScaleDenominator: 50 },
  output: { impliedScaleDenominator: 60, denominatorGap: 10 },
} satisfies ToolExample<Input, Output>;
export const museumObjectModelScaleGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/museum-object-model-scale-gap",
    title: "Museum Object Model Scale Gap Tool",
    description:
      "Check a public museum model’s explicit scale dimensions, without operational equipment guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        artifactLength: { type: "number", exclusiveMinimum: 0 },
        modelLength: { type: "number", exclusiveMinimum: 0 },
        declaredScaleDenominator: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["artifactLength", "modelLength", "declaredScaleDenominator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        impliedScaleDenominator: { type: "number" },
        denominatorGap: { type: "number" },
      },
      required: ["impliedScaleDenominator", "denominatorGap"],
    },
    ports: {
      inputs: [
        {
          id: "artifactLength",
          label: "Artifact Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "modelLength",
          label: "Model Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "declaredScaleDenominator",
          label: "Declared Scale Denominator",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "impliedScaleDenominator",
          label: "Implied Scale Denominator",
          valueType: { type: "number" },
        },
        {
          id: "denominatorGap",
          label: "Denominator Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = museumObjectModelScaleGapTool.execute;
export default museumObjectModelScaleGapTool;
