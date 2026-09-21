import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hitLengths: readonly number[];
  readonly transectLength: number;
};
export type Output = {
  readonly coveredLength: number;
  readonly coverFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hitLengths: { type: "array", maxItems: 256, items: { type: "number" } },
    transectLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["hitLengths", "transectLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredLength: { type: "number" },
    coverFraction: { type: "number" },
  },
  required: ["coveredLength", "coverFraction"],
} as const;
/** Sum disjoint covered intercept lengths, not overlapping point-hit probabilities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hitLengths, transectLength } = request;
  const compute = (): Output => {
    H.positive(transectLength);
    H.domain(
      hitLengths.every((x) => x >= 0) &&
        hitLengths.reduce((a, b) => a + b, 0) <= transectLength,
    );
    return {
      coveredLength: hitLengths.reduce((a, b) => a + b, 0),
      coverFraction: hitLengths.reduce((a, b) => a + b, 0) / transectLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hitLengths: [1, 2, 1], transectLength: 10 },
  output: { coveredLength: 4, coverFraction: 0.4 },
} satisfies ToolExample<Input, Output>;
export const residueCoverLineInterceptOneHitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/residue-cover-line-intercept-one-hit",
    title: "Residue Cover Line Intercept One Hit Tool",
    description:
      "Sum disjoint covered intercept lengths, not overlapping point-hit probabilities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hitLengths: { type: "array", maxItems: 256, items: { type: "number" } },
        transectLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["hitLengths", "transectLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coveredLength: { type: "number" },
        coverFraction: { type: "number" },
      },
      required: ["coveredLength", "coverFraction"],
    },
    ports: {
      inputs: [
        {
          id: "hitLengths",
          label: "Hit Lengths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "transectLength",
          label: "Transect Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "coveredLength",
          label: "Covered Length",
          valueType: { type: "number" },
        },
        {
          id: "coverFraction",
          label: "Cover Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = residueCoverLineInterceptOneHitTool.execute;
export default residueCoverLineInterceptOneHitTool;
