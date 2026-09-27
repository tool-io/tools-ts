import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spotDomesticPerForeign: number;
  readonly forwardDomesticPerForeign: number;
  readonly domesticRate: number;
  readonly foreignRate: number;
  readonly years: number;
};
export type Output = {
  readonly parityForward: number;
  readonly forwardGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spotDomesticPerForeign: { type: "number", exclusiveMinimum: 0 },
    forwardDomesticPerForeign: { type: "number", exclusiveMinimum: 0 },
    domesticRate: { type: "number" },
    foreignRate: { type: "number" },
    years: { type: "number", minimum: 0 },
  },
  required: [
    "spotDomesticPerForeign",
    "forwardDomesticPerForeign",
    "domesticRate",
    "foreignRate",
    "years",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parityForward: { type: "number" },
    forwardGap: { type: "number" },
  },
  required: ["parityForward", "forwardGap"],
} as const;
/** Simple-interest covered parity, quote is domestic currency per foreign currency, with matched maturities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    spotDomesticPerForeign,
    forwardDomesticPerForeign,
    domesticRate,
    foreignRate,
    years,
  } = request;
  const compute = (): Output => {
    H.positive(spotDomesticPerForeign);
    H.positive(forwardDomesticPerForeign);
    H.domain(
      years >= 0 && 1 + domesticRate * years > 0 && 1 + foreignRate * years > 0,
    );
    return {
      parityForward:
        (spotDomesticPerForeign * (1 + domesticRate * years)) /
        (1 + foreignRate * years),
      forwardGap:
        forwardDomesticPerForeign -
        (spotDomesticPerForeign * (1 + domesticRate * years)) /
          (1 + foreignRate * years),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    spotDomesticPerForeign: 1.2,
    forwardDomesticPerForeign: 1.25,
    domesticRate: 0.05,
    foreignRate: 0,
    years: 1,
  },
  output: { parityForward: 1.26, forwardGap: -0.010000000000000009 },
} satisfies ToolExample<Input, Output>;
export const fxCoveredInterestParityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/fx-covered-interest-parity-gap",
    title: "Fx Covered Interest Parity Gap Tool",
    description:
      "Simple-interest covered parity, quote is domestic currency per foreign currency, with matched maturities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spotDomesticPerForeign: { type: "number", exclusiveMinimum: 0 },
        forwardDomesticPerForeign: { type: "number", exclusiveMinimum: 0 },
        domesticRate: { type: "number" },
        foreignRate: { type: "number" },
        years: { type: "number", minimum: 0 },
      },
      required: [
        "spotDomesticPerForeign",
        "forwardDomesticPerForeign",
        "domesticRate",
        "foreignRate",
        "years",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parityForward: { type: "number" },
        forwardGap: { type: "number" },
      },
      required: ["parityForward", "forwardGap"],
    },
    ports: {
      inputs: [
        {
          id: "spotDomesticPerForeign",
          label: "Spot Domestic Per Foreign",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "forwardDomesticPerForeign",
          label: "Forward Domestic Per Foreign",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "domesticRate",
          label: "Domestic Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "foreignRate",
          label: "Foreign Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "years",
          label: "Years",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "parityForward",
          label: "Parity Forward",
          valueType: { type: "number" },
        },
        {
          id: "forwardGap",
          label: "Forward Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fxCoveredInterestParityGapTool.execute;
export default fxCoveredInterestParityGapTool;
