import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coverFraction: number;
  readonly targetCoverFraction: number;
};
export type Output = {
  readonly bareFraction: number;
  readonly coverGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coverFraction: { type: "number", minimum: 0, maximum: 1 },
    targetCoverFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["coverFraction", "targetCoverFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bareFraction: { type: "number" },
    coverGap: { type: "number" },
  },
  required: ["bareFraction", "coverGap"],
} as const;
/** Calculate groundcover bare soil fraction gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coverFraction, targetCoverFraction } = request;
  const compute = (): Output => {
    H.probability(coverFraction);
    H.probability(targetCoverFraction);
    return {
      bareFraction: 1 - coverFraction,
      coverGap: coverFraction - targetCoverFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coverFraction: 0.7, targetCoverFraction: 0.8 },
  output: { bareFraction: 0.30000000000000004, coverGap: -0.10000000000000009 },
} satisfies ToolExample<Input, Output>;
export const groundcoverBareSoilFractionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/groundcover-bare-soil-fraction-gap",
    title: "Groundcover Bare Soil Fraction Gap Tool",
    description:
      "Calculate groundcover bare soil fraction gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coverFraction: { type: "number", minimum: 0, maximum: 1 },
        targetCoverFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["coverFraction", "targetCoverFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bareFraction: { type: "number" },
        coverGap: { type: "number" },
      },
      required: ["bareFraction", "coverGap"],
    },
    ports: {
      inputs: [
        {
          id: "coverFraction",
          label: "Cover Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetCoverFraction",
          label: "Target Cover Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "bareFraction",
          label: "Bare Fraction",
          valueType: { type: "number" },
        },
        { id: "coverGap", label: "Cover Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = groundcoverBareSoilFractionGapTool.execute;
export default groundcoverBareSoilFractionGapTool;
