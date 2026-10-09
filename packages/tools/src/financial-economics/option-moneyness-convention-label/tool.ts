import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spot: number;
  readonly strike: number;
  readonly callOption: boolean;
};
export type Output = {
  readonly intrinsicValue: number;
  readonly state: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spot: { type: "number", minimum: 0 },
    strike: { type: "number", minimum: 0 },
    callOption: { type: "boolean" },
  },
  required: ["spot", "strike", "callOption"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intrinsicValue: { type: "number" },
    state: { type: "string", maxLength: 8192 },
  },
  required: ["intrinsicValue", "state"],
} as const;
/** Label spot intrinsic moneyness under a supplied call/put convention without pricing an option. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spot, strike, callOption } = request;
  const compute = (): Output => {
    H.domain(spot >= 0 && strike >= 0, "spot");
    return (() => {
      const signed = callOption ? spot - strike : strike - spot;
      return {
        intrinsicValue: Math.max(0, signed),
        state:
          signed > 0
            ? "in-the-money"
            : signed < 0
              ? "out-of-the-money"
              : "at-the-money",
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { spot: 105, strike: 100, callOption: true },
  output: { intrinsicValue: 5, state: "in-the-money" },
} satisfies ToolExample<Input, Output>;
export const optionMoneynessConventionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: ["financial-economics", "financial economics", "economics"],
      keywords: ["financial economics", "economics"],
    },
    id: "financial-economics/option-moneyness-convention-label",
    title: "Option Moneyness Convention Label",
    description:
      "Label spot intrinsic moneyness under a supplied call/put convention without pricing an option.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spot: { type: "number", minimum: 0 },
        strike: { type: "number", minimum: 0 },
        callOption: { type: "boolean" },
      },
      required: ["spot", "strike", "callOption"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intrinsicValue: { type: "number" },
        state: { type: "string", maxLength: 8192 },
      },
      required: ["intrinsicValue", "state"],
    },
    ports: {
      inputs: [
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
          id: "callOption",
          label: "Call Option",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "intrinsicValue",
          label: "Intrinsic Value",
          valueType: { type: "number" },
        },
        { id: "state", label: "State", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = optionMoneynessConventionLabelTool.execute;
export default optionMoneynessConventionLabelTool;
