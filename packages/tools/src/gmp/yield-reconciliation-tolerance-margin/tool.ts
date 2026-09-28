import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputMass: number;
  readonly accountedMass: number;
  readonly suppliedTolerance: number;
  readonly useRelativeTolerance: boolean;
};
export type Output = {
  readonly residual: number;
  readonly toleranceWidth: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputMass: { type: "number", minimum: 0 },
    accountedMass: { type: "number", minimum: 0 },
    suppliedTolerance: { type: "number", minimum: 0 },
    useRelativeTolerance: { type: "boolean" },
  },
  required: [
    "inputMass",
    "accountedMass",
    "suppliedTolerance",
    "useRelativeTolerance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residual: { type: "number" },
    toleranceWidth: { type: "number" },
    margin: { type: "number" },
  },
  required: ["residual", "toleranceWidth", "margin"],
} as const;
/** Compare supplied mass reconciliation against an explicit absolute/relative tolerance without a GMP release decision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputMass, accountedMass, suppliedTolerance, useRelativeTolerance } =
    request;
  const compute = (): Output => {
    H.domain(inputMass >= 0 && accountedMass >= 0 && suppliedTolerance >= 0);
    return {
      residual: inputMass - accountedMass,
      toleranceWidth: useRelativeTolerance
        ? Math.abs(inputMass) * suppliedTolerance
        : suppliedTolerance,
      margin:
        (useRelativeTolerance
          ? Math.abs(inputMass) * suppliedTolerance
          : suppliedTolerance) - Math.abs(inputMass - accountedMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inputMass: 100,
    accountedMass: 98,
    suppliedTolerance: 0.05,
    useRelativeTolerance: true,
  },
  output: { residual: 2, toleranceWidth: 5, margin: 3 },
} satisfies ToolExample<Input, Output>;
export const yieldReconciliationToleranceMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/yield-reconciliation-tolerance-margin",
    title: "Yield Reconciliation Tolerance Margin Tool",
    description:
      "Compare supplied mass reconciliation against an explicit absolute/relative tolerance without a GMP release decision.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputMass: { type: "number", minimum: 0 },
        accountedMass: { type: "number", minimum: 0 },
        suppliedTolerance: { type: "number", minimum: 0 },
        useRelativeTolerance: { type: "boolean" },
      },
      required: [
        "inputMass",
        "accountedMass",
        "suppliedTolerance",
        "useRelativeTolerance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residual: { type: "number" },
        toleranceWidth: { type: "number" },
        margin: { type: "number" },
      },
      required: ["residual", "toleranceWidth", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "inputMass",
          label: "Input Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "accountedMass",
          label: "Accounted Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTolerance",
          label: "Supplied Tolerance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useRelativeTolerance",
          label: "Use Relative Tolerance",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "number" } },
        {
          id: "toleranceWidth",
          label: "Tolerance Width",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = yieldReconciliationToleranceMarginTool.execute;
export default yieldReconciliationToleranceMarginTool;
