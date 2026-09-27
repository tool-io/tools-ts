import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly callPrice: number;
  readonly putPrice: number;
  readonly spot: number;
  readonly strike: number;
  readonly discountFactor: number;
  readonly dividendPresentValue: number;
};
export type Output = {
  readonly left: number;
  readonly right: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    callPrice: { type: "number", minimum: 0 },
    putPrice: { type: "number", minimum: 0 },
    spot: { type: "number", minimum: 0 },
    strike: { type: "number", minimum: 0 },
    discountFactor: { type: "number", exclusiveMinimum: 0 },
    dividendPresentValue: { type: "number", minimum: 0 },
  },
  required: [
    "callPrice",
    "putPrice",
    "spot",
    "strike",
    "discountFactor",
    "dividendPresentValue",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "number" },
    right: { type: "number" },
    residual: { type: "number" },
  },
  required: ["left", "right", "residual"],
} as const;
/** European call-put parity residual using an explicit strike discount factor and present value of known dividends. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    callPrice,
    putPrice,
    spot,
    strike,
    discountFactor,
    dividendPresentValue,
  } = request;
  const compute = (): Output => {
    H.domain(
      callPrice >= 0 &&
        putPrice >= 0 &&
        spot >= 0 &&
        strike >= 0 &&
        dividendPresentValue >= 0,
    );
    H.positive(discountFactor);
    return {
      left: callPrice - putPrice,
      right: spot - dividendPresentValue - strike * discountFactor,
      residual:
        callPrice -
        putPrice -
        spot +
        dividendPresentValue +
        strike * discountFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    callPrice: 12,
    putPrice: 5,
    spot: 100,
    strike: 100,
    discountFactor: 0.95,
    dividendPresentValue: 2,
  },
  output: { left: 7, right: 3, residual: 4 },
} satisfies ToolExample<Input, Output>;
export const optionPutcallParityResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/option-putcall-parity-residual",
    title: "Option Putcall Parity Residual Tool",
    description:
      "European call-put parity residual using an explicit strike discount factor and present value of known dividends.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        callPrice: { type: "number", minimum: 0 },
        putPrice: { type: "number", minimum: 0 },
        spot: { type: "number", minimum: 0 },
        strike: { type: "number", minimum: 0 },
        discountFactor: { type: "number", exclusiveMinimum: 0 },
        dividendPresentValue: { type: "number", minimum: 0 },
      },
      required: [
        "callPrice",
        "putPrice",
        "spot",
        "strike",
        "discountFactor",
        "dividendPresentValue",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        left: { type: "number" },
        right: { type: "number" },
        residual: { type: "number" },
      },
      required: ["left", "right", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "callPrice",
          label: "Call Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "putPrice",
          label: "Put Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spot",
          label: "Spot",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "strike",
          label: "Strike",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discountFactor",
          label: "Discount Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dividendPresentValue",
          label: "Dividend Present Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "left", label: "Left", valueType: { type: "number" } },
        { id: "right", label: "Right", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = optionPutcallParityResidualTool.execute;
export default optionPutcallParityResidualTool;
