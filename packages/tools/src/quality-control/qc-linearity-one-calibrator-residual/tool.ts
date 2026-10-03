import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly signal: number;
  readonly intercept: number;
  readonly slope: number;
  readonly suppliedTolerance: number;
};
export type Output = {
  readonly expected: number;
  readonly residual: number;
  readonly relativeResidual: number;
  readonly within: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number" },
    signal: { type: "number" },
    intercept: { type: "number" },
    slope: { type: "number" },
    suppliedTolerance: { type: "number", minimum: 0 },
  },
  required: [
    "concentration",
    "signal",
    "intercept",
    "slope",
    "suppliedTolerance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expected: { type: "number" },
    residual: { type: "number" },
    relativeResidual: { type: "number" },
    within: { type: "boolean" },
  },
  required: ["expected", "residual", "relativeResidual", "within"],
} as const;
/** Calculate qc linearity one calibrator residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, signal, intercept, slope, suppliedTolerance } =
    request;
  const compute = (): Output => {
    H.domain(intercept + slope * concentration !== 0 && suppliedTolerance >= 0);
    return {
      expected: intercept + slope * concentration,
      residual: signal - intercept - slope * concentration,
      relativeResidual:
        (signal - intercept - slope * concentration) /
        (intercept + slope * concentration),
      within:
        Math.abs(signal - intercept - slope * concentration) <=
        suppliedTolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    concentration: 2,
    signal: 12,
    intercept: 1,
    slope: 5,
    suppliedTolerance: 2,
  },
  output: {
    expected: 11,
    residual: 1,
    relativeResidual: 0.09090909090909091,
    within: true,
  },
} satisfies ToolExample<Input, Output>;
export const qcLinearityOneCalibratorResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/qc-linearity-one-calibrator-residual",
    title: "QC Linearity One Calibrator Residual Tool",
    description:
      "Calculate qc linearity one calibrator residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number" },
        signal: { type: "number" },
        intercept: { type: "number" },
        slope: { type: "number" },
        suppliedTolerance: { type: "number", minimum: 0 },
      },
      required: [
        "concentration",
        "signal",
        "intercept",
        "slope",
        "suppliedTolerance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expected: { type: "number" },
        residual: { type: "number" },
        relativeResidual: { type: "number" },
        within: { type: "boolean" },
      },
      required: ["expected", "residual", "relativeResidual", "within"],
    },
    ports: {
      inputs: [
        {
          id: "concentration",
          label: "Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "signal",
          label: "Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "intercept",
          label: "Intercept",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slope",
          label: "Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTolerance",
          label: "Supplied Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "expected", label: "Expected", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
        {
          id: "relativeResidual",
          label: "Relative Residual",
          valueType: { type: "number" },
        },
        { id: "within", label: "Within", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = qcLinearityOneCalibratorResidualTool.execute;
export default qcLinearityOneCalibratorResidualTool;
