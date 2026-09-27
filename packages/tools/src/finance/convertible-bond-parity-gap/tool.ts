import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bondPrice: number;
  readonly conversionRatio: number;
  readonly sharePrice: number;
};
export type Output = { readonly parity: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bondPrice: { type: "number", minimum: 0 },
    conversionRatio: { type: "number", minimum: 0 },
    sharePrice: { type: "number", minimum: 0 },
  },
  required: ["bondPrice", "conversionRatio", "sharePrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { parity: { type: "number" }, gap: { type: "number" } },
  required: ["parity", "gap"],
} as const;
/** Calculate convertible bond parity gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bondPrice, conversionRatio, sharePrice } = request;
  const compute = (): Output => {
    H.domain(bondPrice >= 0 && conversionRatio >= 0 && sharePrice >= 0);
    const parity = conversionRatio * sharePrice;
    return { parity, gap: bondPrice - parity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bondPrice: 1050, conversionRatio: 20, sharePrice: 50 },
  output: { parity: 1000, gap: 50 },
} satisfies ToolExample<Input, Output>;
export const convertibleBondParityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/convertible-bond-parity-gap",
    title: "Convertible Bond Parity Gap Tool",
    description:
      "Calculate convertible bond parity gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bondPrice: { type: "number", minimum: 0 },
        conversionRatio: { type: "number", minimum: 0 },
        sharePrice: { type: "number", minimum: 0 },
      },
      required: ["bondPrice", "conversionRatio", "sharePrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { parity: { type: "number" }, gap: { type: "number" } },
      required: ["parity", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "bondPrice",
          label: "Bond Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "conversionRatio",
          label: "Conversion Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharePrice",
          label: "Share Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "parity", label: "Parity", valueType: { type: "number" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = convertibleBondParityGapTool.execute;
export default convertibleBondParityGapTool;
