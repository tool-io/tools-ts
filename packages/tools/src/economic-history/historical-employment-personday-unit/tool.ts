import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly quantityText: string;
  readonly personDayConvention: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    quantityText: { type: "string", maxLength: 8192, minLength: 1 },
    personDayConvention: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "quantityText", "personDayConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit historical employment person-day quantity and unit convention without assuming hours per day. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, quantityText, personDayConvention } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(quantityText.length > 0, "quantityText");
    H.domain(personDayConvention.length > 0, "personDayConvention");
    return {
      token: JSON.stringify([recordId, quantityText, personDayConvention]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    quantityText: "12",
    personDayConvention: "one recorded worker-day",
  },
  output: { token: '["R17","12","one recorded worker-day"]' },
} satisfies ToolExample<Input, Output>;
export const historicalEmploymentPersondayUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/historical-employment-personday-unit",
    title: "Historical Employment Personday Unit Tool",
    description:
      "Preserve explicit historical employment person-day quantity and unit convention without assuming hours per day.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        quantityText: { type: "string", maxLength: 8192, minLength: 1 },
        personDayConvention: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "quantityText", "personDayConvention"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "quantityText",
          label: "Quantity Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "personDayConvention",
          label: "Person Day Convention",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = historicalEmploymentPersondayUnitTool.execute;
export default historicalEmploymentPersondayUnitTool;
