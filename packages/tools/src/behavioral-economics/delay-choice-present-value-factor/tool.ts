import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly delayPeriods: number;
  readonly suppliedDiscountFactorPerPeriod: number;
};
export type Output = { readonly presentValueFactor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delayPeriods: { type: "number", minimum: 0 },
    suppliedDiscountFactorPerPeriod: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["delayPeriods", "suppliedDiscountFactorPerPeriod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { presentValueFactor: { type: "number" } },
  required: ["presentValueFactor"],
} as const;
/** Raise an explicit positive per-period discount factor to a supplied nonnegative delay without selecting a preference model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { delayPeriods, suppliedDiscountFactorPerPeriod } = request;
  const compute = (): Output => {
    H.domain(delayPeriods >= 0, "delayPeriods");
    (H.domain(
      Number.isFinite(suppliedDiscountFactorPerPeriod) &&
        suppliedDiscountFactorPerPeriod > 0,
      "suppliedDiscountFactorPerPeriod",
    ),
      suppliedDiscountFactorPerPeriod);
    return {
      presentValueFactor: Math.pow(
        suppliedDiscountFactorPerPeriod,
        delayPeriods,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { delayPeriods: 2, suppliedDiscountFactorPerPeriod: 0.5 },
  output: { presentValueFactor: 0.25 },
} satisfies ToolExample<Input, Output>;
export const delayChoicePresentValueFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["behavioral-economics", "behavioral economics", "economics"],
      keywords: ["behavioral economics", "economics"],
    },
    id: "behavioral-economics/delay-choice-present-value-factor",
    title: "Delay Choice Present Value Factor",
    description:
      "Raise an explicit positive per-period discount factor to a supplied nonnegative delay without selecting a preference model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delayPeriods: { type: "number", minimum: 0 },
        suppliedDiscountFactorPerPeriod: {
          type: "number",
          exclusiveMinimum: 0,
        },
      },
      required: ["delayPeriods", "suppliedDiscountFactorPerPeriod"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { presentValueFactor: { type: "number" } },
      required: ["presentValueFactor"],
    },
    ports: {
      inputs: [
        {
          id: "delayPeriods",
          label: "Delay Periods",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDiscountFactorPerPeriod",
          label: "Supplied Discount Factor Per Period",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "presentValueFactor",
          label: "Present Value Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = delayChoicePresentValueFactorTool.execute;
export default delayChoicePresentValueFactorTool;
