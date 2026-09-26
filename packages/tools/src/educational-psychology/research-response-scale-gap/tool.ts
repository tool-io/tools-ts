import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstMinimum: number;
  readonly firstMaximum: number;
  readonly secondMinimum: number;
  readonly secondMaximum: number;
  readonly response: number;
};
export type Output = {
  readonly firstFraction: number;
  readonly secondFraction: number;
  readonly normalizedGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstMinimum: { type: "number" },
    firstMaximum: { type: "number" },
    secondMinimum: { type: "number" },
    secondMaximum: { type: "number" },
    response: { type: "number" },
  },
  required: [
    "firstMinimum",
    "firstMaximum",
    "secondMinimum",
    "secondMaximum",
    "response",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstFraction: { type: "number" },
    secondFraction: { type: "number" },
    normalizedGap: { type: "number" },
  },
  required: ["firstFraction", "secondFraction", "normalizedGap"],
} as const;
/** Compare one supplied response under two explicit affine scales; outside-scale fractions remain visible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstMinimum, firstMaximum, secondMinimum, secondMaximum, response } =
    request;
  const compute = (): Output => {
    H.domain(firstMaximum > firstMinimum && secondMaximum > secondMinimum);
    return {
      firstFraction: (response - firstMinimum) / (firstMaximum - firstMinimum),
      secondFraction:
        (response - secondMinimum) / (secondMaximum - secondMinimum),
      normalizedGap:
        (response - secondMinimum) / (secondMaximum - secondMinimum) -
        (response - firstMinimum) / (firstMaximum - firstMinimum),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstMinimum: 0,
    firstMaximum: 10,
    secondMinimum: 0,
    secondMaximum: 20,
    response: 5,
  },
  output: { firstFraction: 0.5, secondFraction: 0.25, normalizedGap: -0.25 },
} satisfies ToolExample<Input, Output>;
export const researchResponseScaleGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/research-response-scale-gap",
    title: "Research Response Scale Gap Tool",
    description:
      "Compare one supplied response under two explicit affine scales; outside-scale fractions remain visible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstMinimum: { type: "number" },
        firstMaximum: { type: "number" },
        secondMinimum: { type: "number" },
        secondMaximum: { type: "number" },
        response: { type: "number" },
      },
      required: [
        "firstMinimum",
        "firstMaximum",
        "secondMinimum",
        "secondMaximum",
        "response",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstFraction: { type: "number" },
        secondFraction: { type: "number" },
        normalizedGap: { type: "number" },
      },
      required: ["firstFraction", "secondFraction", "normalizedGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstMinimum",
          label: "First Minimum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstMaximum",
          label: "First Maximum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondMinimum",
          label: "Second Minimum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondMaximum",
          label: "Second Maximum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "response",
          label: "Response",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstFraction",
          label: "First Fraction",
          valueType: { type: "number" },
        },
        {
          id: "secondFraction",
          label: "Second Fraction",
          valueType: { type: "number" },
        },
        {
          id: "normalizedGap",
          label: "Normalized Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchResponseScaleGapTool.execute;
export default researchResponseScaleGapTool;
