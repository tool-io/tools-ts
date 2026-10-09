import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseCurrencyCost: number;
  readonly localUnitsPerBaseUnit: number;
};
export type Output = { readonly localCurrencyCost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseCurrencyCost: { type: "number" },
    localUnitsPerBaseUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["baseCurrencyCost", "localUnitsPerBaseUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { localCurrencyCost: { type: "number" } },
  required: ["localCurrencyCost"],
} as const;
/** Convert an explicit signed humanitarian project cost with a supplied positive local-units-per-base-unit quotation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseCurrencyCost, localUnitsPerBaseUnit } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(localUnitsPerBaseUnit) && localUnitsPerBaseUnit > 0,
      "localUnitsPerBaseUnit",
    ),
      localUnitsPerBaseUnit);
    return { localCurrencyCost: baseCurrencyCost * localUnitsPerBaseUnit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseCurrencyCost: 1000, localUnitsPerBaseUnit: 1.5 },
  output: { localCurrencyCost: 1500 },
} satisfies ToolExample<Input, Output>;
export const humanitarianGrantLocalcurrencyCostTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "global-studies/humanitarian-grant-localcurrency-cost-term",
      title: "Humanitarian Grant Localcurrency Cost Term Tool",
      description:
        "Convert an explicit signed humanitarian project cost with a supplied positive local-units-per-base-unit quotation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baseCurrencyCost: { type: "number" },
          localUnitsPerBaseUnit: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["baseCurrencyCost", "localUnitsPerBaseUnit"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { localCurrencyCost: { type: "number" } },
        required: ["localCurrencyCost"],
      },
      ports: {
        inputs: [
          {
            id: "baseCurrencyCost",
            label: "Base Currency Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "localUnitsPerBaseUnit",
            label: "Local Units Per Base Unit",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "localCurrencyCost",
            label: "Local Currency Cost",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = humanitarianGrantLocalcurrencyCostTermTool.execute;
export default humanitarianGrantLocalcurrencyCostTermTool;
