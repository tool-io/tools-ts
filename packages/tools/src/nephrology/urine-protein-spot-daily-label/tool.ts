import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultId: string;
  readonly value: number;
  readonly unitText: string;
  readonly basis: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultId: { type: "string", maxLength: 8192, minLength: 1 },
    value: { type: "number", minimum: 0 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
    basis: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultId", "value", "unitText", "basis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicit urine-protein value and basis wording without converting a spot ratio into daily excretion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultId, value, unitText, basis } = request;
  const compute = (): Output => {
    H.domain(
      resultId.length > 0 && unitText.length > 0 && basis.length > 0,
      "resultId",
    );
    H.domain(value >= 0, "value");
    return {
      label: resultId + "; " + value + " " + unitText + " [" + basis + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resultId: "R17",
    value: 0.2,
    unitText: "g/day",
    basis: "timed daily amount",
  },
  output: { label: "R17; 0.2 g/day [timed daily amount]" },
} satisfies ToolExample<Input, Output>;
export const urineProteinSpotDailyLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["nephrology", "health and medicine"],
      keywords: ["nephrology", "health and medicine"],
    },
    id: "nephrology/urine-protein-spot-daily-label",
    title: "Urine Protein Spot Daily Label",
    description:
      "Label explicit urine-protein value and basis wording without converting a spot ratio into daily excretion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultId: { type: "string", maxLength: 8192, minLength: 1 },
        value: { type: "number", minimum: 0 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
        basis: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["resultId", "value", "unitText", "basis"],
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
          id: "resultId",
          label: "Result Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "basis",
          label: "Basis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = urineProteinSpotDailyLabelTool.execute;
export default urineProteinSpotDailyLabelTool;
