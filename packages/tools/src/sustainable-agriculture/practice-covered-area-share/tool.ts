import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coveredArea: number;
  readonly totalArea: number;
  readonly excludedCoveredArea: number;
};
export type Output = {
  readonly creditedArea: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredArea: { type: "number", minimum: 0 },
    totalArea: { type: "number", exclusiveMinimum: 0 },
    excludedCoveredArea: { type: "number", minimum: 0 },
  },
  required: ["coveredArea", "totalArea", "excludedCoveredArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditedArea: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["creditedArea", "fraction"],
} as const;
/** Audit supplied practice coverage area without asserting environmental benefit or certification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coveredArea, totalArea, excludedCoveredArea } = request;
  const compute = (): Output => {
    H.positive(totalArea);
    H.domain(
      coveredArea >= 0 &&
        coveredArea <= totalArea &&
        excludedCoveredArea >= 0 &&
        excludedCoveredArea <= coveredArea,
    );
    return {
      creditedArea: coveredArea - excludedCoveredArea,
      fraction: (coveredArea - excludedCoveredArea) / totalArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coveredArea: 60, totalArea: 100, excludedCoveredArea: 10 },
  output: { creditedArea: 50, fraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const practiceCoveredAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/practice-covered-area-share",
    title: "Practice Covered Area Share Tool",
    description:
      "Audit supplied practice coverage area without asserting environmental benefit or certification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coveredArea: { type: "number", minimum: 0 },
        totalArea: { type: "number", exclusiveMinimum: 0 },
        excludedCoveredArea: { type: "number", minimum: 0 },
      },
      required: ["coveredArea", "totalArea", "excludedCoveredArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creditedArea: { type: "number" },
        fraction: { type: "number" },
      },
      required: ["creditedArea", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "coveredArea",
          label: "Covered Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalArea",
          label: "Total Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedCoveredArea",
          label: "Excluded Covered Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "creditedArea",
          label: "Credited Area",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = practiceCoveredAreaShareTool.execute;
export default practiceCoveredAreaShareTool;
