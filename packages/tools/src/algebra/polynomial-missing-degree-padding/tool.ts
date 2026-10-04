import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly degrees: readonly number[];
  readonly coefficients: readonly number[];
  readonly maximumDegree: number;
};
export type Output = { readonly ascendingCoefficients: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    degrees: { type: "array", maxItems: 256, items: { type: "integer" } },
    coefficients: { type: "array", maxItems: 256, items: { type: "number" } },
    maximumDegree: { type: "integer", minimum: 0, maximum: 255 },
  },
  required: ["degrees", "coefficients", "maximumDegree"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ascendingCoefficients: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["ascendingCoefficients"],
} as const;
/** Pad a sparse polynomial into ascending degree order through an explicit maximum degree. Duplicate or out-of-range degrees are rejected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { degrees, coefficients, maximumDegree } = request;
  const compute = (): Output => {
    H.sameLength(degrees, coefficients);
    (H.domain(
      Number.isSafeInteger(maximumDegree) &&
        maximumDegree >= 0 &&
        maximumDegree <= 255,
      "maximumDegree",
    ),
      maximumDegree);
    H.domain(new Set(degrees).size === degrees.length, "degrees");
    degrees.forEach((d) => H.integer(d, 0, maximumDegree));
    const ascendingCoefficients = Array<number>(maximumDegree + 1).fill(0);
    degrees.forEach((d, i) => (ascendingCoefficients[d] = coefficients[i]));
    return { ascendingCoefficients };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { degrees: [3, 0, 1], coefficients: [2, 7, -4], maximumDegree: 4 },
  output: { ascendingCoefficients: [7, -4, 0, 2, 0] },
} satisfies ToolExample<Input, Output>;
export const polynomialMissingDegreePaddingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/polynomial-missing-degree-padding",
    title: "Polynomial Missing Degree Padding Tool",
    description:
      "Pad a sparse polynomial into ascending degree order through an explicit maximum degree. Duplicate or out-of-range degrees are rejected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        degrees: { type: "array", maxItems: 256, items: { type: "integer" } },
        coefficients: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        maximumDegree: { type: "integer", minimum: 0, maximum: 255 },
      },
      required: ["degrees", "coefficients", "maximumDegree"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ascendingCoefficients: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["ascendingCoefficients"],
    },
    ports: {
      inputs: [
        {
          id: "degrees",
          label: "Degrees",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "coefficients",
          label: "Coefficients",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "maximumDegree",
          label: "Maximum Degree",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "ascendingCoefficients",
          label: "Ascending Coefficients",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = polynomialMissingDegreePaddingTool.execute;
export default polynomialMissingDegreePaddingTool;
