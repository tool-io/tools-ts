import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly dryFraction: number;
  readonly suppliedCarbonFraction: number;
  readonly ashFraction: number;
};
export type Output = {
  readonly ashFreeDryMass: number;
  readonly carbonMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    dryFraction: { type: "number", minimum: 0, maximum: 1 },
    suppliedCarbonFraction: { type: "number", minimum: 0, maximum: 1 },
    ashFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["wetMass", "dryFraction", "suppliedCarbonFraction", "ashFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ashFreeDryMass: { type: "number" },
    carbonMass: { type: "number" },
  },
  required: ["ashFreeDryMass", "carbonMass"],
} as const;
/** Calculate composting bin carbon mass share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, dryFraction, suppliedCarbonFraction, ashFraction } = request;
  const compute = (): Output => {
    H.domain(wetMass >= 0);
    H.probability(dryFraction);
    H.probability(suppliedCarbonFraction);
    H.probability(ashFraction);
    return {
      ashFreeDryMass: wetMass * dryFraction * (1 - ashFraction),
      carbonMass:
        wetMass * dryFraction * (1 - ashFraction) * suppliedCarbonFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    wetMass: 100,
    dryFraction: 0.5,
    suppliedCarbonFraction: 0.4,
    ashFraction: 0.1,
  },
  output: { ashFreeDryMass: 45, carbonMass: 18 },
} satisfies ToolExample<Input, Output>;
export const compostingBinCarbonMassShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/composting-bin-carbon-mass-share",
    title: "Composting Bin Carbon Mass Share Tool",
    description:
      "Calculate composting bin carbon mass share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", minimum: 0 },
        dryFraction: { type: "number", minimum: 0, maximum: 1 },
        suppliedCarbonFraction: { type: "number", minimum: 0, maximum: 1 },
        ashFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "wetMass",
        "dryFraction",
        "suppliedCarbonFraction",
        "ashFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ashFreeDryMass: { type: "number" },
        carbonMass: { type: "number" },
      },
      required: ["ashFreeDryMass", "carbonMass"],
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
          id: "dryFraction",
          label: "Dry Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "suppliedCarbonFraction",
          label: "Supplied Carbon Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "ashFraction",
          label: "Ash Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "ashFreeDryMass",
          label: "Ash Free Dry Mass",
          valueType: { type: "number" },
        },
        {
          id: "carbonMass",
          label: "Carbon Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = compostingBinCarbonMassShareTool.execute;
export default compostingBinCarbonMassShareTool;
