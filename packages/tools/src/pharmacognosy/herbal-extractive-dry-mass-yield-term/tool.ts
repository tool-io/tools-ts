import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly airDryInput: number;
  readonly moistureFraction: number;
  readonly recoveredSolids: number;
};
export type Output = {
  readonly dryInput: number;
  readonly yieldFraction: number;
  readonly airDryYield: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    airDryInput: { type: "number", exclusiveMinimum: 0 },
    moistureFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    recoveredSolids: { type: "number", minimum: 0 },
  },
  required: ["airDryInput", "moistureFraction", "recoveredSolids"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryInput: { type: "number" },
    yieldFraction: { type: "number" },
    airDryYield: { type: "number" },
  },
  required: ["dryInput", "yieldFraction", "airDryYield"],
} as const;
/** Calculate herbal extractive dry mass yield term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { airDryInput, moistureFraction, recoveredSolids } = request;
  const compute = (): Output => {
    H.positive(airDryInput);
    H.domain(
      moistureFraction >= 0 && moistureFraction < 1 && recoveredSolids >= 0,
    );
    return {
      dryInput: airDryInput * (1 - moistureFraction),
      yieldFraction: recoveredSolids / (airDryInput * (1 - moistureFraction)),
      airDryYield: recoveredSolids / airDryInput,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { airDryInput: 100, moistureFraction: 0.2, recoveredSolids: 16 },
  output: { dryInput: 80, yieldFraction: 0.2, airDryYield: 0.16 },
} satisfies ToolExample<Input, Output>;
export const herbalExtractiveDryMassYieldTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacognosy/herbal-extractive-dry-mass-yield-term",
    title: "Herbal Extractive Dry Mass Yield Term Tool",
    description:
      "Calculate herbal extractive dry mass yield term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        airDryInput: { type: "number", exclusiveMinimum: 0 },
        moistureFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        recoveredSolids: { type: "number", minimum: 0 },
      },
      required: ["airDryInput", "moistureFraction", "recoveredSolids"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryInput: { type: "number" },
        yieldFraction: { type: "number" },
        airDryYield: { type: "number" },
      },
      required: ["dryInput", "yieldFraction", "airDryYield"],
    },
    ports: {
      inputs: [
        {
          id: "airDryInput",
          label: "Air Dry Input",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "moistureFraction",
          label: "Moisture Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recoveredSolids",
          label: "Recovered Solids",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryInput", label: "Dry Input", valueType: { type: "number" } },
        {
          id: "yieldFraction",
          label: "Yield Fraction",
          valueType: { type: "number" },
        },
        {
          id: "airDryYield",
          label: "Air Dry Yield",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = herbalExtractiveDryMassYieldTermTool.execute;
export default herbalExtractiveDryMassYieldTermTool;
