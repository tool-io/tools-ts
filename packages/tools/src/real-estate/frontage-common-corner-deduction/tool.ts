import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstFrontage: number;
  readonly secondFrontage: number;
  readonly sharedCornerMeasure: number;
};
export type Output = { readonly uniqueFrontage: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstFrontage: { type: "number", minimum: 0 },
    secondFrontage: { type: "number", minimum: 0 },
    sharedCornerMeasure: { type: "number", minimum: 0 },
  },
  required: ["firstFrontage", "secondFrontage", "sharedCornerMeasure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { uniqueFrontage: { type: "number" } },
  required: ["uniqueFrontage"],
} as const;
/** Calculate frontage common corner deduction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstFrontage, secondFrontage, sharedCornerMeasure } = request;
  const compute = (): Output => {
    H.domain(
      firstFrontage >= 0 &&
        secondFrontage >= 0 &&
        sharedCornerMeasure >= 0 &&
        sharedCornerMeasure <= Math.min(firstFrontage, secondFrontage),
    );
    return {
      uniqueFrontage: firstFrontage + secondFrontage - sharedCornerMeasure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstFrontage: 30, secondFrontage: 20, sharedCornerMeasure: 5 },
  output: { uniqueFrontage: 45 },
} satisfies ToolExample<Input, Output>;
export const frontageCommonCornerDeductionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/frontage-common-corner-deduction",
    title: "Frontage Common Corner Deduction Tool",
    description:
      "Calculate frontage common corner deduction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstFrontage: { type: "number", minimum: 0 },
        secondFrontage: { type: "number", minimum: 0 },
        sharedCornerMeasure: { type: "number", minimum: 0 },
      },
      required: ["firstFrontage", "secondFrontage", "sharedCornerMeasure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { uniqueFrontage: { type: "number" } },
      required: ["uniqueFrontage"],
    },
    ports: {
      inputs: [
        {
          id: "firstFrontage",
          label: "First Frontage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondFrontage",
          label: "Second Frontage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedCornerMeasure",
          label: "Shared Corner Measure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uniqueFrontage",
          label: "Unique Frontage",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = frontageCommonCornerDeductionTool.execute;
export default frontageCommonCornerDeductionTool;
