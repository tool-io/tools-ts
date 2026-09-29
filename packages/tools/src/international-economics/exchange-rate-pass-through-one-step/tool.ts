import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialPrice: number;
  readonly exchangeRateChangeFraction: number;
  readonly passThroughElasticity: number;
  readonly useLogChange: boolean;
};
export type Output = {
  readonly priceFactor: number;
  readonly newPrice: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialPrice: { type: "number" },
    exchangeRateChangeFraction: { type: "number" },
    passThroughElasticity: { type: "number" },
    useLogChange: { type: "boolean" },
  },
  required: [
    "initialPrice",
    "exchangeRateChangeFraction",
    "passThroughElasticity",
    "useLogChange",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { priceFactor: { type: "number" }, newPrice: { type: "number" } },
  required: ["priceFactor", "newPrice"],
} as const;
/** Constant exchange-rate elasticity with an explicit log-change versus simple-change input convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    initialPrice,
    exchangeRateChangeFraction,
    passThroughElasticity,
    useLogChange,
  } = request;
  const compute = (): Output => {
    H.domain(
      initialPrice >= 0 && (useLogChange || exchangeRateChangeFraction > -1),
    );
    return {
      priceFactor: useLogChange
        ? Math.exp(passThroughElasticity * exchangeRateChangeFraction)
        : (1 + exchangeRateChangeFraction) ** passThroughElasticity,
      newPrice:
        initialPrice *
        (useLogChange
          ? Math.exp(passThroughElasticity * exchangeRateChangeFraction)
          : (1 + exchangeRateChangeFraction) ** passThroughElasticity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialPrice: 100,
    exchangeRateChangeFraction: 0.21,
    passThroughElasticity: 0.5,
    useLogChange: false,
  },
  output: { priceFactor: 1.1, newPrice: 110.00000000000001 },
} satisfies ToolExample<Input, Output>;
export const exchangeRatePassThroughOneStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/exchange-rate-pass-through-one-step",
    title: "Exchange Rate Pass Through One Step Tool",
    description:
      "Constant exchange-rate elasticity with an explicit log-change versus simple-change input convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialPrice: { type: "number" },
        exchangeRateChangeFraction: { type: "number" },
        passThroughElasticity: { type: "number" },
        useLogChange: { type: "boolean" },
      },
      required: [
        "initialPrice",
        "exchangeRateChangeFraction",
        "passThroughElasticity",
        "useLogChange",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priceFactor: { type: "number" },
        newPrice: { type: "number" },
      },
      required: ["priceFactor", "newPrice"],
    },
    ports: {
      inputs: [
        {
          id: "initialPrice",
          label: "Initial Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exchangeRateChangeFraction",
          label: "Exchange Rate Change Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "passThroughElasticity",
          label: "Pass Through Elasticity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useLogChange",
          label: "Use Log Change",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "priceFactor",
          label: "Price Factor",
          valueType: { type: "number" },
        },
        { id: "newPrice", label: "New Price", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = exchangeRatePassThroughOneStepTool.execute;
export default exchangeRatePassThroughOneStepTool;
