import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedIntake: number;
  readonly recordedOutput: number;
  readonly measuredStorageChange: number;
  readonly unmeasuredLossEstimate: number;
};
export type Output = {
  readonly intakeOutputBalance: number;
  readonly closureResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedIntake: { type: "number", minimum: 0 },
    recordedOutput: { type: "number", minimum: 0 },
    measuredStorageChange: { type: "number" },
    unmeasuredLossEstimate: { type: "number" },
  },
  required: [
    "recordedIntake",
    "recordedOutput",
    "measuredStorageChange",
    "unmeasuredLossEstimate",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intakeOutputBalance: { type: "number" },
    closureResidual: { type: "number" },
  },
  required: ["intakeOutputBalance", "closureResidual"],
} as const;
/** Explicit research volume ledger residual, without estimating physiological losses or recommending fluid intake. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    recordedIntake,
    recordedOutput,
    measuredStorageChange,
    unmeasuredLossEstimate,
  } = request;
  const compute = (): Output => {
    H.domain(recordedIntake >= 0 && recordedOutput >= 0);
    return {
      intakeOutputBalance: recordedIntake - recordedOutput,
      closureResidual:
        recordedIntake -
        recordedOutput -
        measuredStorageChange -
        unmeasuredLossEstimate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedIntake: 2000,
    recordedOutput: 1500,
    measuredStorageChange: 100,
    unmeasuredLossEstimate: 300,
  },
  output: { intakeOutputBalance: 500, closureResidual: 100 },
} satisfies ToolExample<Input, Output>;
export const urologyDiaryFluidBalanceResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urology/urology-diary-fluid-balance-residual",
    title: "Urology Diary Fluid Balance Residual Tool",
    description:
      "Explicit research volume ledger residual, without estimating physiological losses or recommending fluid intake.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedIntake: { type: "number", minimum: 0 },
        recordedOutput: { type: "number", minimum: 0 },
        measuredStorageChange: { type: "number" },
        unmeasuredLossEstimate: { type: "number" },
      },
      required: [
        "recordedIntake",
        "recordedOutput",
        "measuredStorageChange",
        "unmeasuredLossEstimate",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intakeOutputBalance: { type: "number" },
        closureResidual: { type: "number" },
      },
      required: ["intakeOutputBalance", "closureResidual"],
    },
    ports: {
      inputs: [
        {
          id: "recordedIntake",
          label: "Recorded Intake",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedOutput",
          label: "Recorded Output",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredStorageChange",
          label: "Measured Storage Change",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unmeasuredLossEstimate",
          label: "Unmeasured Loss Estimate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "intakeOutputBalance",
          label: "Intake Output Balance",
          valueType: { type: "number" },
        },
        {
          id: "closureResidual",
          label: "Closure Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = urologyDiaryFluidBalanceResidualTool.execute;
export default urologyDiaryFluidBalanceResidualTool;
