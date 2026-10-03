import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly result: number;
  readonly lower: number;
  readonly upper: number;
  readonly guardband: number;
};
export type Output = {
  readonly acceptLower: number;
  readonly acceptUpper: number;
  readonly lowerMargin: number;
  readonly upperMargin: number;
  readonly inside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    result: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
    guardband: { type: "number", minimum: 0 },
  },
  required: ["result", "lower", "upper", "guardband"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    acceptLower: { type: "number" },
    acceptUpper: { type: "number" },
    lowerMargin: { type: "number" },
    upperMargin: { type: "number" },
    inside: { type: "boolean" },
  },
  required: [
    "acceptLower",
    "acceptUpper",
    "lowerMargin",
    "upperMargin",
    "inside",
  ],
} as const;
/** Calculate calibration guardband supplied width term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { result, lower, upper, guardband } = request;
  const compute = (): Output => {
    H.domain(
      upper >= lower && guardband >= 0 && 2 * guardband <= upper - lower,
    );
    return {
      acceptLower: lower + guardband,
      acceptUpper: upper - guardband,
      lowerMargin: result - lower - guardband,
      upperMargin: upper - guardband - result,
      inside: result >= lower + guardband && result <= upper - guardband,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { result: 5, lower: 0, upper: 10, guardband: 1 },
  output: {
    acceptLower: 1,
    acceptUpper: 9,
    lowerMargin: 4,
    upperMargin: 4,
    inside: true,
  },
} satisfies ToolExample<Input, Output>;
export const calibrationGuardbandSuppliedWidthTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "quality-control/calibration-guardband-supplied-width-term",
      title: "Calibration Guardband Supplied Width Term Tool",
      description:
        "Calculate calibration guardband supplied width term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          result: { type: "number" },
          lower: { type: "number" },
          upper: { type: "number" },
          guardband: { type: "number", minimum: 0 },
        },
        required: ["result", "lower", "upper", "guardband"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          acceptLower: { type: "number" },
          acceptUpper: { type: "number" },
          lowerMargin: { type: "number" },
          upperMargin: { type: "number" },
          inside: { type: "boolean" },
        },
        required: [
          "acceptLower",
          "acceptUpper",
          "lowerMargin",
          "upperMargin",
          "inside",
        ],
      },
      ports: {
        inputs: [
          {
            id: "result",
            label: "Result",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lower",
            label: "Lower",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upper",
            label: "Upper",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "guardband",
            label: "Guardband",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "acceptLower",
            label: "Accept Lower",
            valueType: { type: "number" },
          },
          {
            id: "acceptUpper",
            label: "Accept Upper",
            valueType: { type: "number" },
          },
          {
            id: "lowerMargin",
            label: "Lower Margin",
            valueType: { type: "number" },
          },
          {
            id: "upperMargin",
            label: "Upper Margin",
            valueType: { type: "number" },
          },
          { id: "inside", label: "Inside", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = calibrationGuardbandSuppliedWidthTermTool.execute;
export default calibrationGuardbandSuppliedWidthTermTool;
