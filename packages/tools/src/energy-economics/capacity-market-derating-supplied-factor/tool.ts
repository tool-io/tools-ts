import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nameplateMw: number;
  readonly deratingFraction: number;
  readonly pricePerMw: number;
};
export type Output = { readonly qualifiedMw: number; readonly payment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nameplateMw: { type: "number", minimum: 0 },
    deratingFraction: { type: "number", minimum: 0, maximum: 1 },
    pricePerMw: { type: "number" },
  },
  required: ["nameplateMw", "deratingFraction", "pricePerMw"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { qualifiedMw: { type: "number" }, payment: { type: "number" } },
  required: ["qualifiedMw", "payment"],
} as const;
/** Calculate capacity market derating supplied factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nameplateMw, deratingFraction, pricePerMw } = request;
  const compute = (): Output => {
    H.domain(nameplateMw >= 0);
    H.probability(deratingFraction);
    return {
      qualifiedMw: nameplateMw * deratingFraction,
      payment: nameplateMw * deratingFraction * pricePerMw,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nameplateMw: 100, deratingFraction: 0.8, pricePerMw: 50000 },
  output: { qualifiedMw: 80, payment: 4000000 },
} satisfies ToolExample<Input, Output>;
export const capacityMarketDeratingSuppliedFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "energy-economics/capacity-market-derating-supplied-factor",
      title: "Capacity Market Derating Supplied Factor Tool",
      description:
        "Calculate capacity market derating supplied factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nameplateMw: { type: "number", minimum: 0 },
          deratingFraction: { type: "number", minimum: 0, maximum: 1 },
          pricePerMw: { type: "number" },
        },
        required: ["nameplateMw", "deratingFraction", "pricePerMw"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          qualifiedMw: { type: "number" },
          payment: { type: "number" },
        },
        required: ["qualifiedMw", "payment"],
      },
      ports: {
        inputs: [
          {
            id: "nameplateMw",
            label: "Nameplate Mw",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deratingFraction",
            label: "Derating Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pricePerMw",
            label: "Price Per Mw",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "qualifiedMw",
            label: "Qualified Mw",
            valueType: { type: "number" },
          },
          { id: "payment", label: "Payment", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = capacityMarketDeratingSuppliedFactorTool.execute;
export default capacityMarketDeratingSuppliedFactorTool;
