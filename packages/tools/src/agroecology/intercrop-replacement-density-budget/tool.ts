import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstFraction: number;
  readonly secondFraction: number;
  readonly firstSoleDensity: number;
  readonly secondSoleDensity: number;
};
export type Output = {
  readonly firstDensity: number;
  readonly secondDensity: number;
  readonly replacementTotal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstFraction: { type: "number", minimum: 0 },
    secondFraction: { type: "number", minimum: 0 },
    firstSoleDensity: { type: "number", minimum: 0 },
    secondSoleDensity: { type: "number", minimum: 0 },
  },
  required: [
    "firstFraction",
    "secondFraction",
    "firstSoleDensity",
    "secondSoleDensity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDensity: { type: "number" },
    secondDensity: { type: "number" },
    replacementTotal: { type: "number" },
  },
  required: ["firstDensity", "secondDensity", "replacementTotal"],
} as const;
/** Relative-density accounting that preserves additive designs above a replacement total of one. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstFraction, secondFraction, firstSoleDensity, secondSoleDensity } =
    request;
  const compute = (): Output => {
    H.domain(
      firstFraction >= 0 &&
        secondFraction >= 0 &&
        firstSoleDensity >= 0 &&
        secondSoleDensity >= 0,
    );
    return {
      firstDensity: firstFraction * firstSoleDensity,
      secondDensity: secondFraction * secondSoleDensity,
      replacementTotal: firstFraction + secondFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstFraction: 0.5,
    secondFraction: 0.5,
    firstSoleDensity: 100,
    secondSoleDensity: 200,
  },
  output: { firstDensity: 50, secondDensity: 100, replacementTotal: 1 },
} satisfies ToolExample<Input, Output>;
export const intercropReplacementDensityBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/intercrop-replacement-density-budget",
    title: "Intercrop Replacement Density Budget Tool",
    description:
      "Relative-density accounting that preserves additive designs above a replacement total of one.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstFraction: { type: "number", minimum: 0 },
        secondFraction: { type: "number", minimum: 0 },
        firstSoleDensity: { type: "number", minimum: 0 },
        secondSoleDensity: { type: "number", minimum: 0 },
      },
      required: [
        "firstFraction",
        "secondFraction",
        "firstSoleDensity",
        "secondSoleDensity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDensity: { type: "number" },
        secondDensity: { type: "number" },
        replacementTotal: { type: "number" },
      },
      required: ["firstDensity", "secondDensity", "replacementTotal"],
    },
    ports: {
      inputs: [
        {
          id: "firstFraction",
          label: "First Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "secondFraction",
          label: "Second Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "firstSoleDensity",
          label: "First Sole Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondSoleDensity",
          label: "Second Sole Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstDensity",
          label: "First Density",
          valueType: { type: "number" },
        },
        {
          id: "secondDensity",
          label: "Second Density",
          valueType: { type: "number" },
        },
        {
          id: "replacementTotal",
          label: "Replacement Total",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = intercropReplacementDensityBudgetTool.execute;
export default intercropReplacementDensityBudgetTool;
