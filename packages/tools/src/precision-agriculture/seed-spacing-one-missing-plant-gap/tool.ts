import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedGap: number;
  readonly nominalSpacing: number;
  readonly endTolerance: number;
};
export type Output = {
  readonly estimatedMissing: number;
  readonly residual: number;
  readonly withinTolerance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedGap: { type: "number", minimum: 0 },
    nominalSpacing: { type: "number", exclusiveMinimum: 0 },
    endTolerance: { type: "number", minimum: 0 },
  },
  required: ["observedGap", "nominalSpacing", "endTolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    estimatedMissing: { type: "integer" },
    residual: { type: "number" },
    withinTolerance: { type: "boolean" },
  },
  required: ["estimatedMissing", "residual", "withinTolerance"],
} as const;
/** Integer-gap interpretation under explicit spacing and measurement tolerance, without detecting plants. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedGap, nominalSpacing, endTolerance } = request;
  const compute = (): Output => {
    H.positive(nominalSpacing);
    H.domain(observedGap >= 0 && endTolerance >= 0);
    return {
      estimatedMissing: Math.max(
        0,
        Math.round(observedGap / nominalSpacing) - 1,
      ),
      residual:
        observedGap - Math.round(observedGap / nominalSpacing) * nominalSpacing,
      withinTolerance:
        Math.abs(
          observedGap -
            Math.round(observedGap / nominalSpacing) * nominalSpacing,
        ) <= endTolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedGap: 0.62, nominalSpacing: 0.2, endTolerance: 0.03 },
  output: {
    estimatedMissing: 2,
    residual: 0.019999999999999907,
    withinTolerance: true,
  },
} satisfies ToolExample<Input, Output>;
export const seedSpacingOneMissingPlantGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/seed-spacing-one-missing-plant-gap",
    title: "Seed Spacing One Missing Plant Gap Tool",
    description:
      "Integer-gap interpretation under explicit spacing and measurement tolerance, without detecting plants.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedGap: { type: "number", minimum: 0 },
        nominalSpacing: { type: "number", exclusiveMinimum: 0 },
        endTolerance: { type: "number", minimum: 0 },
      },
      required: ["observedGap", "nominalSpacing", "endTolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        estimatedMissing: { type: "integer" },
        residual: { type: "number" },
        withinTolerance: { type: "boolean" },
      },
      required: ["estimatedMissing", "residual", "withinTolerance"],
    },
    ports: {
      inputs: [
        {
          id: "observedGap",
          label: "Observed Gap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nominalSpacing",
          label: "Nominal Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endTolerance",
          label: "End Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "estimatedMissing",
          label: "Estimated Missing",
          valueType: { type: "integer" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
        {
          id: "withinTolerance",
          label: "Within Tolerance",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = seedSpacingOneMissingPlantGapTool.execute;
export default seedSpacingOneMissingPlantGapTool;
