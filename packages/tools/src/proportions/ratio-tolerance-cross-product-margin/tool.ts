import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstNumerator: number;
  readonly firstDenominator: number;
  readonly secondNumerator: number;
  readonly secondDenominator: number;
  readonly tolerance: number;
};
export type Output = {
  readonly residual: number;
  readonly withinTolerance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstNumerator: { type: "number" },
    firstDenominator: { type: "number" },
    secondNumerator: { type: "number" },
    secondDenominator: { type: "number" },
    tolerance: { type: "number", minimum: 0 },
  },
  required: [
    "firstNumerator",
    "firstDenominator",
    "secondNumerator",
    "secondDenominator",
    "tolerance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residual: { type: "number" },
    withinTolerance: { type: "boolean" },
  },
  required: ["residual", "withinTolerance"],
} as const;
/** Calculate ratio tolerance cross product margin from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstNumerator,
    firstDenominator,
    secondNumerator,
    secondDenominator,
    tolerance,
  } = request;
  const compute = (): Output => {
    H.domain(
      firstDenominator !== 0 && secondDenominator !== 0 && tolerance >= 0,
    );
    const residual =
      firstNumerator * secondDenominator - secondNumerator * firstDenominator;
    return { residual, withinTolerance: Math.abs(residual) <= tolerance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstNumerator: 2,
    firstDenominator: 3,
    secondNumerator: 4,
    secondDenominator: 6,
    tolerance: 0,
  },
  output: { residual: 0, withinTolerance: true },
} satisfies ToolExample<Input, Output>;
export const ratioToleranceCrossProductMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/ratio-tolerance-cross-product-margin",
    title: "Ratio Tolerance Cross Product Margin Tool",
    description:
      "Calculate ratio tolerance cross product margin from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstNumerator: { type: "number" },
        firstDenominator: { type: "number" },
        secondNumerator: { type: "number" },
        secondDenominator: { type: "number" },
        tolerance: { type: "number", minimum: 0 },
      },
      required: [
        "firstNumerator",
        "firstDenominator",
        "secondNumerator",
        "secondDenominator",
        "tolerance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residual: { type: "number" },
        withinTolerance: { type: "boolean" },
      },
      required: ["residual", "withinTolerance"],
    },
    ports: {
      inputs: [
        {
          id: "firstNumerator",
          label: "First Numerator",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstDenominator",
          label: "First Denominator",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondNumerator",
          label: "Second Numerator",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDenominator",
          label: "Second Denominator",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
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
export const run = ratioToleranceCrossProductMarginTool.execute;
export default ratioToleranceCrossProductMarginTool;
