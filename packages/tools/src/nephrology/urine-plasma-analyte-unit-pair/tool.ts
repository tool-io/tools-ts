import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly analyteCode: string;
  readonly urineUnit: string;
  readonly plasmaUnit: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    analyteCode: { type: "string", maxLength: 8192, minLength: 1 },
    urineUnit: { type: "string", maxLength: 8192, minLength: 1 },
    plasmaUnit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["analyteCode", "urineUnit", "plasmaUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit urine and plasma analyte unit labels without assuming compatible concentration scales. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { analyteCode, urineUnit, plasmaUnit } = request;
  const compute = (): Output => {
    H.domain(analyteCode.length > 0, "analyteCode");
    H.domain(urineUnit.length > 0, "urineUnit");
    H.domain(plasmaUnit.length > 0, "plasmaUnit");
    return { token: JSON.stringify([analyteCode, urineUnit, plasmaUnit]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { analyteCode: "A17", urineUnit: "mg/L", plasmaUnit: "mg/dL" },
  output: { token: '["A17","mg/L","mg/dL"]' },
} satisfies ToolExample<Input, Output>;
export const urinePlasmaAnalyteUnitPairTool = H.defineSchemaCalculation<
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
    id: "nephrology/urine-plasma-analyte-unit-pair",
    title: "Urine Plasma Analyte Unit Pair",
    description:
      "Record explicit urine and plasma analyte unit labels without assuming compatible concentration scales.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        analyteCode: { type: "string", maxLength: 8192, minLength: 1 },
        urineUnit: { type: "string", maxLength: 8192, minLength: 1 },
        plasmaUnit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["analyteCode", "urineUnit", "plasmaUnit"],
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
          id: "analyteCode",
          label: "Analyte Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "urineUnit",
          label: "Urine Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "plasmaUnit",
          label: "Plasma Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = urinePlasmaAnalyteUnitPairTool.execute;
export default urinePlasmaAnalyteUnitPairTool;
