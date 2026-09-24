import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labelAmount: number;
  readonly labelBasis: number;
  readonly targetBasis: number;
  readonly suppliedAmountUnit: string;
  readonly suppliedBasisUnit: string;
};
export type Output = {
  readonly amountAtTargetBasis: number;
  readonly amountUnit: string;
  readonly basisUnit: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labelAmount: { type: "number", minimum: 0 },
    labelBasis: { type: "number", exclusiveMinimum: 0 },
    targetBasis: { type: "number", minimum: 0 },
    suppliedAmountUnit: { type: "string", maxLength: 8192 },
    suppliedBasisUnit: { type: "string", maxLength: 8192 },
  },
  required: [
    "labelAmount",
    "labelBasis",
    "targetBasis",
    "suppliedAmountUnit",
    "suppliedBasisUnit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amountAtTargetBasis: { type: "number" },
    amountUnit: { type: "string", maxLength: 8192 },
    basisUnit: { type: "string", maxLength: 8192 },
  },
  required: ["amountAtTargetBasis", "amountUnit", "basisUnit"],
} as const;
/** Rescale explicitly supplied label content on its declared basis; no dose or treatment recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    labelAmount,
    labelBasis,
    targetBasis,
    suppliedAmountUnit,
    suppliedBasisUnit,
  } = request;
  const compute = (): Output => {
    H.domain(
      labelAmount >= 0 &&
        suppliedAmountUnit.length > 0 &&
        suppliedBasisUnit.length > 0,
    );
    H.positive(labelBasis);
    H.domain(targetBasis >= 0);
    return {
      amountAtTargetBasis: (labelAmount / labelBasis) * targetBasis,
      amountUnit: suppliedAmountUnit,
      basisUnit: suppliedBasisUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    labelAmount: 20,
    labelBasis: 10,
    targetBasis: 5,
    suppliedAmountUnit: "mg",
    suppliedBasisUnit: "mL",
  },
  output: { amountAtTargetBasis: 10, amountUnit: "mg", basisUnit: "mL" },
} satisfies ToolExample<Input, Output>;
export const medicineLabelStrengthBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-pharmacy/medicine-label-strength-basis-factor",
    title: "Medicine Label Strength Basis Factor Tool",
    description:
      "Rescale explicitly supplied label content on its declared basis; no dose or treatment recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labelAmount: { type: "number", minimum: 0 },
        labelBasis: { type: "number", exclusiveMinimum: 0 },
        targetBasis: { type: "number", minimum: 0 },
        suppliedAmountUnit: { type: "string", maxLength: 8192 },
        suppliedBasisUnit: { type: "string", maxLength: 8192 },
      },
      required: [
        "labelAmount",
        "labelBasis",
        "targetBasis",
        "suppliedAmountUnit",
        "suppliedBasisUnit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amountAtTargetBasis: { type: "number" },
        amountUnit: { type: "string", maxLength: 8192 },
        basisUnit: { type: "string", maxLength: 8192 },
      },
      required: ["amountAtTargetBasis", "amountUnit", "basisUnit"],
    },
    ports: {
      inputs: [
        {
          id: "labelAmount",
          label: "Label Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "labelBasis",
          label: "Label Basis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetBasis",
          label: "Target Basis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedAmountUnit",
          label: "Supplied Amount Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedBasisUnit",
          label: "Supplied Basis Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "amountAtTargetBasis",
          label: "Amount At Target Basis",
          valueType: { type: "number" },
        },
        {
          id: "amountUnit",
          label: "Amount Unit",
          valueType: { type: "string" },
        },
        { id: "basisUnit", label: "Basis Unit", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = medicineLabelStrengthBasisFactorTool.execute;
export default medicineLabelStrengthBasisFactorTool;
