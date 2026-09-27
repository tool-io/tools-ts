import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly valueUnit: string;
  readonly uncertaintyUnit: string;
  readonly uncertaintyDigits: string;
};
export type Output = {
  readonly sharesUnit: boolean;
  readonly displaySuffix: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valueUnit: { type: "string", maxLength: 8192 },
    uncertaintyUnit: { type: "string", maxLength: 8192 },
    uncertaintyDigits: { type: "string", maxLength: 8192 },
  },
  required: ["valueUnit", "uncertaintyUnit", "uncertaintyDigits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sharesUnit: { type: "boolean" },
    displaySuffix: { type: "string", maxLength: 8192 },
  },
  required: ["sharesUnit", "displaySuffix"],
} as const;
/** Check supplied uncertainty/value unit labels and construct a parenthesis suffix; digits are already aligned by the caller. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { valueUnit, uncertaintyUnit, uncertaintyDigits } = request;
  const compute = (): Output => {
    H.domain(/^\d+(?![\s\S])/.test(uncertaintyDigits));
    return {
      sharesUnit: valueUnit === uncertaintyUnit,
      displaySuffix:
        "(" +
        uncertaintyDigits +
        ")" +
        (valueUnit === uncertaintyUnit
          ? " " + valueUnit
          : " " + uncertaintyUnit + "; value " + valueUnit),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { valueUnit: "m", uncertaintyUnit: "m", uncertaintyDigits: "12" },
  output: { sharesUnit: true, displaySuffix: "(12) m" },
} satisfies ToolExample<Input, Output>;
export const measurementUncertaintyParenthesisUnitGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "format/measurement-uncertainty-parenthesis-unit-gap",
      title: "Measurement Uncertainty Parenthesis Unit Gap Tool",
      description:
        "Check supplied uncertainty/value unit labels and construct a parenthesis suffix; digits are already aligned by the caller.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          valueUnit: { type: "string", maxLength: 8192 },
          uncertaintyUnit: { type: "string", maxLength: 8192 },
          uncertaintyDigits: { type: "string", maxLength: 8192 },
        },
        required: ["valueUnit", "uncertaintyUnit", "uncertaintyDigits"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sharesUnit: { type: "boolean" },
          displaySuffix: { type: "string", maxLength: 8192 },
        },
        required: ["sharesUnit", "displaySuffix"],
      },
      ports: {
        inputs: [
          {
            id: "valueUnit",
            label: "Value Unit",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "uncertaintyUnit",
            label: "Uncertainty Unit",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "uncertaintyDigits",
            label: "Uncertainty Digits",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "sharesUnit",
            label: "Shares Unit",
            valueType: { type: "boolean" },
          },
          {
            id: "displaySuffix",
            label: "Display Suffix",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = measurementUncertaintyParenthesisUnitGapTool.execute;
export default measurementUncertaintyParenthesisUnitGapTool;
