import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outcome: number;
  readonly reference: number;
  readonly gainExponent: number;
  readonly lossExponent: number;
  readonly lossAversion: number;
};
export type Output = {
  readonly relativeOutcome: number;
  readonly value: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outcome: { type: "number" },
    reference: { type: "number" },
    gainExponent: { type: "number", exclusiveMinimum: 0 },
    lossExponent: { type: "number", exclusiveMinimum: 0 },
    lossAversion: { type: "number", minimum: 0 },
  },
  required: [
    "outcome",
    "reference",
    "gainExponent",
    "lossExponent",
    "lossAversion",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeOutcome: { type: "number" },
    value: { type: "number" },
  },
  required: ["relativeOutcome", "value"],
} as const;
/** Piecewise power value with explicit gain/loss exponents and loss-aversion coefficient. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outcome, reference, gainExponent, lossExponent, lossAversion } =
    request;
  const compute = (): Output => {
    H.positive(gainExponent);
    H.positive(lossExponent);
    H.domain(lossAversion >= 0);
    return {
      relativeOutcome: outcome - reference,
      value:
        outcome >= reference
          ? (outcome - reference) ** gainExponent
          : -lossAversion * (reference - outcome) ** lossExponent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    outcome: 120,
    reference: 100,
    gainExponent: 0.5,
    lossExponent: 0.5,
    lossAversion: 2,
  },
  output: { relativeOutcome: 20, value: 4.47213595499958 },
} satisfies ToolExample<Input, Output>;
export const prospectLossAversionValueGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/prospect-loss-aversion-value-gap",
    title: "Prospect Loss Aversion Value Gap Tool",
    description:
      "Piecewise power value with explicit gain/loss exponents and loss-aversion coefficient.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outcome: { type: "number" },
        reference: { type: "number" },
        gainExponent: { type: "number", exclusiveMinimum: 0 },
        lossExponent: { type: "number", exclusiveMinimum: 0 },
        lossAversion: { type: "number", minimum: 0 },
      },
      required: [
        "outcome",
        "reference",
        "gainExponent",
        "lossExponent",
        "lossAversion",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeOutcome: { type: "number" },
        value: { type: "number" },
      },
      required: ["relativeOutcome", "value"],
    },
    ports: {
      inputs: [
        {
          id: "outcome",
          label: "Outcome",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gainExponent",
          label: "Gain Exponent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lossExponent",
          label: "Loss Exponent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lossAversion",
          label: "Loss Aversion",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeOutcome",
          label: "Relative Outcome",
          valueType: { type: "number" },
        },
        { id: "value", label: "Value", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = prospectLossAversionValueGapTool.execute;
export default prospectLossAversionValueGapTool;
