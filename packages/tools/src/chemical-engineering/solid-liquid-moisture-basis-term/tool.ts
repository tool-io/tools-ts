import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly waterFraction: number;
  readonly dryBasisConcentration: number;
};
export type Output = {
  readonly dryMass: number;
  readonly constituentMass: number;
  readonly wetBasisConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    waterFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    dryBasisConcentration: { type: "number", minimum: 0 },
  },
  required: ["wetMass", "waterFraction", "dryBasisConcentration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number" },
    constituentMass: { type: "number" },
    wetBasisConcentration: { type: "number" },
  },
  required: ["dryMass", "constituentMass", "wetBasisConcentration"],
} as const;
/** Calculate solid liquid moisture basis term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, waterFraction, dryBasisConcentration } = request;
  const compute = (): Output => {
    H.domain(
      wetMass >= 0 &&
        waterFraction >= 0 &&
        waterFraction < 1 &&
        dryBasisConcentration >= 0,
    );
    return {
      dryMass: wetMass * (1 - waterFraction),
      constituentMass: wetMass * (1 - waterFraction) * dryBasisConcentration,
      wetBasisConcentration: (1 - waterFraction) * dryBasisConcentration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMass: 100, waterFraction: 0.2, dryBasisConcentration: 0.1 },
  output: {
    dryMass: 80,
    constituentMass: 8,
    wetBasisConcentration: 0.08000000000000002,
  },
} satisfies ToolExample<Input, Output>;
export const solidLiquidMoistureBasisTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/solid-liquid-moisture-basis-term",
    title: "Solid Liquid Moisture Basis Term Tool",
    description:
      "Calculate solid liquid moisture basis term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", minimum: 0 },
        waterFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        dryBasisConcentration: { type: "number", minimum: 0 },
      },
      required: ["wetMass", "waterFraction", "dryBasisConcentration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number" },
        constituentMass: { type: "number" },
        wetBasisConcentration: { type: "number" },
      },
      required: ["dryMass", "constituentMass", "wetBasisConcentration"],
    },
    ports: {
      inputs: [
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterFraction",
          label: "Water Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "dryBasisConcentration",
          label: "Dry Basis Concentration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
        {
          id: "constituentMass",
          label: "Constituent Mass",
          valueType: { type: "number" },
        },
        {
          id: "wetBasisConcentration",
          label: "Wet Basis Concentration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = solidLiquidMoistureBasisTermTool.execute;
export default solidLiquidMoistureBasisTermTool;
