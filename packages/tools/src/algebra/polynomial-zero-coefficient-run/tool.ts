import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coefficients: readonly number[];
  readonly startIndex: number;
};
export type Output = {
  readonly runLength: number;
  readonly endExclusive: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficients: { type: "array", maxItems: 256, items: { type: "number" } },
    startIndex: { type: "integer", minimum: 0 },
  },
  required: ["coefficients", "startIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    runLength: { type: "integer" },
    endExclusive: { type: "integer" },
  },
  required: ["runLength", "endExclusive"],
} as const;
/** Count a literal zero run in explicitly ordered polynomial coefficients without tolerance-based trimming. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coefficients, startIndex } = request;
  const compute = (): Output => {
    H.integer(startIndex, 0, coefficients.length);
    let endExclusive = startIndex;
    while (
      endExclusive < coefficients.length &&
      coefficients[endExclusive] === 0
    )
      endExclusive++;
    return { runLength: endExclusive - startIndex, endExclusive };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coefficients: [2, 0, 0, 3], startIndex: 1 },
  output: { runLength: 2, endExclusive: 3 },
} satisfies ToolExample<Input, Output>;
export const polynomialZeroCoefficientRunTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/polynomial-zero-coefficient-run",
    title: "Polynomial Zero Coefficient Run Tool",
    description:
      "Count a literal zero run in explicitly ordered polynomial coefficients without tolerance-based trimming.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coefficients: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        startIndex: { type: "integer", minimum: 0 },
      },
      required: ["coefficients", "startIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        runLength: { type: "integer" },
        endExclusive: { type: "integer" },
      },
      required: ["runLength", "endExclusive"],
    },
    ports: {
      inputs: [
        {
          id: "coefficients",
          label: "Coefficients",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "startIndex",
          label: "Start Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "runLength",
          label: "Run Length",
          valueType: { type: "integer" },
        },
        {
          id: "endExclusive",
          label: "End Exclusive",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = polynomialZeroCoefficientRunTool.execute;
export default polynomialZeroCoefficientRunTool;
