import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amountToken: string;
  readonly unitToken: string;
  readonly permittedUnits: readonly string[];
};
export type Output = {
  readonly amount: number;
  readonly unit: string;
  readonly unitPermitted: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amountToken: { type: "string", maxLength: 8192 },
    unitToken: { type: "string", maxLength: 8192 },
    permittedUnits: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["amountToken", "unitToken", "permittedUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amount: { type: "number" },
    unit: { type: "string", maxLength: 8192 },
    unitPermitted: { type: "boolean" },
  },
  required: ["amount", "unit", "unitPermitted"],
} as const;
/** Parse a supplied amount/unit record without dose conversion or regimen advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amountToken, unitToken, permittedUnits } = request;
  const compute = (): Output => {
    H.domain(
      /^(?:0|[1-9]\d*)(?:\.\d+)?(?![\s\S])/.test(amountToken),
      "amountToken",
    );
    const amount = Number(amountToken);
    H.finite(amount);
    H.domain(unitToken.length > 0, "unitToken");
    return {
      amount,
      unit: unitToken,
      unitPermitted: permittedUnits.includes(unitToken),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amountToken: "12.5", unitToken: "mg", permittedUnits: ["mg", "g"] },
  output: { amount: 12.5, unit: "mg", unitPermitted: true },
} satisfies ToolExample<Input, Output>;
export const trialDoseRecordUnitOnlyTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/trial-dose-record-unit-only-token",
    title: "Trial Dose Record Unit Only Token Tool",
    description:
      "Parse a supplied amount/unit record without dose conversion or regimen advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amountToken: { type: "string", maxLength: 8192 },
        unitToken: { type: "string", maxLength: 8192 },
        permittedUnits: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["amountToken", "unitToken", "permittedUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amount: { type: "number" },
        unit: { type: "string", maxLength: 8192 },
        unitPermitted: { type: "boolean" },
      },
      required: ["amount", "unit", "unitPermitted"],
    },
    ports: {
      inputs: [
        {
          id: "amountToken",
          label: "Amount Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unitToken",
          label: "Unit Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "permittedUnits",
          label: "Permitted Units",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "amount", label: "Amount", valueType: { type: "number" } },
        { id: "unit", label: "Unit", valueType: { type: "string" } },
        {
          id: "unitPermitted",
          label: "Unit Permitted",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialDoseRecordUnitOnlyTokenTool.execute;
export default trialDoseRecordUnitOnlyTokenTool;
