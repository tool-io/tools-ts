import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly silverFineMass: number;
  readonly goldFineMass: number;
  readonly silverPricePerMass: number;
  readonly goldPricePerMass: number;
};
export type Output = {
  readonly silverValue: number;
  readonly goldValue: number;
  readonly valueRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    silverFineMass: { type: "number", minimum: 0 },
    goldFineMass: { type: "number", exclusiveMinimum: 0 },
    silverPricePerMass: { type: "number", minimum: 0 },
    goldPricePerMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "silverFineMass",
    "goldFineMass",
    "silverPricePerMass",
    "goldPricePerMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    silverValue: { type: "number" },
    goldValue: { type: "number" },
    valueRatio: { type: "number" },
  },
  required: ["silverValue", "goldValue", "valueRatio"],
} as const;
/** Calculate silver gold parity caller unit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { silverFineMass, goldFineMass, silverPricePerMass, goldPricePerMass } =
    request;
  const compute = (): Output => {
    H.domain(silverFineMass >= 0 && silverPricePerMass >= 0);
    H.positive(goldFineMass);
    H.positive(goldPricePerMass);
    return {
      silverValue: silverFineMass * silverPricePerMass,
      goldValue: goldFineMass * goldPricePerMass,
      valueRatio:
        (silverFineMass * silverPricePerMass) /
        (goldFineMass * goldPricePerMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    silverFineMass: 15,
    goldFineMass: 1,
    silverPricePerMass: 2,
    goldPricePerMass: 30,
  },
  output: { silverValue: 30, goldValue: 30, valueRatio: 1 },
} satisfies ToolExample<Input, Output>;
export const silverGoldParityCallerUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/silver-gold-parity-caller-unit",
    title: "Silver Gold Parity Caller Unit Tool",
    description:
      "Calculate silver gold parity caller unit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        silverFineMass: { type: "number", minimum: 0 },
        goldFineMass: { type: "number", exclusiveMinimum: 0 },
        silverPricePerMass: { type: "number", minimum: 0 },
        goldPricePerMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "silverFineMass",
        "goldFineMass",
        "silverPricePerMass",
        "goldPricePerMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        silverValue: { type: "number" },
        goldValue: { type: "number" },
        valueRatio: { type: "number" },
      },
      required: ["silverValue", "goldValue", "valueRatio"],
    },
    ports: {
      inputs: [
        {
          id: "silverFineMass",
          label: "Silver Fine Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "goldFineMass",
          label: "Gold Fine Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "silverPricePerMass",
          label: "Silver Price Per Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "goldPricePerMass",
          label: "Gold Price Per Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "silverValue",
          label: "Silver Value",
          valueType: { type: "number" },
        },
        { id: "goldValue", label: "Gold Value", valueType: { type: "number" } },
        {
          id: "valueRatio",
          label: "Value Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = silverGoldParityCallerUnitTool.execute;
export default silverGoldParityCallerUnitTool;
