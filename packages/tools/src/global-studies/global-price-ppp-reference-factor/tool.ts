import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localCurrencyAmount: number;
  readonly localCurrencyPerInternationalUnit: number;
};
export type Output = { readonly internationalUnits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localCurrencyAmount: { type: "number" },
    localCurrencyPerInternationalUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["localCurrencyAmount", "localCurrencyPerInternationalUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { internationalUnits: { type: "number" } },
  required: ["internationalUnits"],
} as const;
/** Apply an explicit purchasing-power conversion factor without providing a PPP series or converting market exchange rates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { localCurrencyAmount, localCurrencyPerInternationalUnit } = request;
  const compute = (): Output => {
    (H.domain(
      localCurrencyPerInternationalUnit > 0,
      "localCurrencyPerInternationalUnit",
    ),
      localCurrencyPerInternationalUnit);
    return {
      internationalUnits:
        localCurrencyAmount / localCurrencyPerInternationalUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { localCurrencyAmount: 250, localCurrencyPerInternationalUnit: 2.5 },
  output: { internationalUnits: 100 },
} satisfies ToolExample<Input, Output>;
export const globalPricePppReferenceFactorTool = H.defineSchemaCalculation<
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
    id: "global-studies/global-price-ppp-reference-factor",
    title: "Global Price PPP Reference Factor",
    description:
      "Apply an explicit purchasing-power conversion factor without providing a PPP series or converting market exchange rates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localCurrencyAmount: { type: "number" },
        localCurrencyPerInternationalUnit: {
          type: "number",
          exclusiveMinimum: 0,
        },
      },
      required: ["localCurrencyAmount", "localCurrencyPerInternationalUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { internationalUnits: { type: "number" } },
      required: ["internationalUnits"],
    },
    ports: {
      inputs: [
        {
          id: "localCurrencyAmount",
          label: "Local Currency Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "localCurrencyPerInternationalUnit",
          label: "Local Currency Per International Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "internationalUnits",
          label: "International Units",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = globalPricePppReferenceFactorTool.execute;
export default globalPricePppReferenceFactorTool;
