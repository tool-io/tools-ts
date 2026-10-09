import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly indicatorCode: string;
  readonly amount: number;
  readonly unitWording: string;
  readonly denominatorWording: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indicatorCode: { type: "string", maxLength: 8192, minLength: 1 },
    amount: { type: "number" },
    unitWording: { type: "string", maxLength: 8192, minLength: 1 },
    denominatorWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["indicatorCode", "amount", "unitWording", "denominatorWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied global indicator value and unit/denominator basis without converting them. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { indicatorCode, amount, unitWording, denominatorWording } = request;
  const compute = (): Output => {
    H.domain(
      indicatorCode.length > 0 &&
        unitWording.length > 0 &&
        denominatorWording.length > 0,
      "indicatorCode",
    );
    return {
      label:
        indicatorCode +
        "; " +
        amount +
        " " +
        unitWording +
        " [per " +
        denominatorWording +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    indicatorCode: "IND17",
    amount: 25,
    unitWording: "USD",
    denominatorWording: "person",
  },
  output: { label: "IND17; 25 USD [per person]" },
} satisfies ToolExample<Input, Output>;
export const globalIndicatorUnitBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["global-studies", "global studies", "social sciences"],
      keywords: ["global studies", "social sciences"],
    },
    id: "global-studies/global-indicator-unit-basis",
    title: "Global Indicator Unit Basis",
    description:
      "Label an explicitly supplied global indicator value and unit/denominator basis without converting them.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        indicatorCode: { type: "string", maxLength: 8192, minLength: 1 },
        amount: { type: "number" },
        unitWording: { type: "string", maxLength: 8192, minLength: 1 },
        denominatorWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: [
        "indicatorCode",
        "amount",
        "unitWording",
        "denominatorWording",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "indicatorCode",
          label: "Indicator Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "amount",
          label: "Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitWording",
          label: "Unit Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "denominatorWording",
          label: "Denominator Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = globalIndicatorUnitBasisTool.execute;
export default globalIndicatorUnitBasisTool;
