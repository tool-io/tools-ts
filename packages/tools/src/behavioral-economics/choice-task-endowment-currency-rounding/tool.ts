import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tokens: number;
  readonly valueMinorPerToken: number;
  readonly rounding: string;
};
export type Output = {
  readonly rawMinor: number;
  readonly settledMinor: number;
  readonly roundingAdjustment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokens: { type: "integer", minimum: 0 },
    valueMinorPerToken: { type: "number", minimum: 0 },
    rounding: {
      type: "string",
      maxLength: 8192,
      enum: ["floor", "ceil", "nearest"],
    },
  },
  required: ["tokens", "valueMinorPerToken", "rounding"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawMinor: { type: "number" },
    settledMinor: { type: "integer" },
    roundingAdjustment: { type: "number" },
  },
  required: ["rawMinor", "settledMinor", "roundingAdjustment"],
} as const;
/** Calculate choice task endowment currency rounding from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokens, valueMinorPerToken, rounding } = request;
  const compute = (): Output => {
    H.integer(tokens, 0);
    H.domain(valueMinorPerToken >= 0);
    H.domain(["floor", "ceil", "nearest"].includes(rounding));
    return {
      rawMinor: tokens * valueMinorPerToken,
      settledMinor:
        rounding === "floor"
          ? Math.floor(tokens * valueMinorPerToken)
          : rounding === "ceil"
            ? Math.ceil(tokens * valueMinorPerToken)
            : Math.round(tokens * valueMinorPerToken),
      roundingAdjustment:
        (rounding === "floor"
          ? Math.floor(tokens * valueMinorPerToken)
          : rounding === "ceil"
            ? Math.ceil(tokens * valueMinorPerToken)
            : Math.round(tokens * valueMinorPerToken)) -
        tokens * valueMinorPerToken,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tokens: 3, valueMinorPerToken: 2.5, rounding: "nearest" },
  output: { rawMinor: 7.5, settledMinor: 8, roundingAdjustment: 0.5 },
} satisfies ToolExample<Input, Output>;
export const choiceTaskEndowmentCurrencyRoundingTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "behavioral-economics/choice-task-endowment-currency-rounding",
      title: "Choice Task Endowment Currency Rounding Tool",
      description:
        "Calculate choice task endowment currency rounding from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tokens: { type: "integer", minimum: 0 },
          valueMinorPerToken: { type: "number", minimum: 0 },
          rounding: {
            type: "string",
            maxLength: 8192,
            enum: ["floor", "ceil", "nearest"],
          },
        },
        required: ["tokens", "valueMinorPerToken", "rounding"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rawMinor: { type: "number" },
          settledMinor: { type: "integer" },
          roundingAdjustment: { type: "number" },
        },
        required: ["rawMinor", "settledMinor", "roundingAdjustment"],
      },
      ports: {
        inputs: [
          {
            id: "tokens",
            label: "Tokens",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "valueMinorPerToken",
            label: "Value Minor Per Token",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rounding",
            label: "Rounding",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "rawMinor", label: "Raw Minor", valueType: { type: "number" } },
          {
            id: "settledMinor",
            label: "Settled Minor",
            valueType: { type: "integer" },
          },
          {
            id: "roundingAdjustment",
            label: "Rounding Adjustment",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = choiceTaskEndowmentCurrencyRoundingTool.execute;
export default choiceTaskEndowmentCurrencyRoundingTool;
