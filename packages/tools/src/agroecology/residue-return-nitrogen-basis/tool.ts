import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly dryFraction: number;
  readonly dryNitrogenFraction: number;
  readonly returnedFraction: number;
};
export type Output = {
  readonly returnedDryMass: number;
  readonly returnedNitrogen: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    dryFraction: { type: "number", minimum: 0, maximum: 1 },
    dryNitrogenFraction: { type: "number", minimum: 0, maximum: 1 },
    returnedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "wetMass",
    "dryFraction",
    "dryNitrogenFraction",
    "returnedFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnedDryMass: { type: "number" },
    returnedNitrogen: { type: "number" },
  },
  required: ["returnedDryMass", "returnedNitrogen"],
} as const;
/** Calculate residue return nitrogen basis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, dryFraction, dryNitrogenFraction, returnedFraction } =
    request;
  const compute = (): Output => {
    H.domain(wetMass >= 0);
    H.probability(dryFraction);
    H.probability(dryNitrogenFraction);
    H.probability(returnedFraction);
    return {
      returnedDryMass: wetMass * dryFraction * returnedFraction,
      returnedNitrogen:
        wetMass * dryFraction * returnedFraction * dryNitrogenFraction,
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
    dryNitrogenFraction: 0.02,
    returnedFraction: 0.8,
  },
  output: { returnedDryMass: 40, returnedNitrogen: 0.8 },
} satisfies ToolExample<Input, Output>;
export const residueReturnNitrogenBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/residue-return-nitrogen-basis",
    title: "Residue Return Nitrogen Basis Tool",
    description:
      "Calculate residue return nitrogen basis from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", minimum: 0 },
        dryFraction: { type: "number", minimum: 0, maximum: 1 },
        dryNitrogenFraction: { type: "number", minimum: 0, maximum: 1 },
        returnedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "wetMass",
        "dryFraction",
        "dryNitrogenFraction",
        "returnedFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        returnedDryMass: { type: "number" },
        returnedNitrogen: { type: "number" },
      },
      required: ["returnedDryMass", "returnedNitrogen"],
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
          id: "dryNitrogenFraction",
          label: "Dry Nitrogen Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "returnedFraction",
          label: "Returned Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "returnedDryMass",
          label: "Returned Dry Mass",
          valueType: { type: "number" },
        },
        {
          id: "returnedNitrogen",
          label: "Returned Nitrogen",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = residueReturnNitrogenBasisTool.execute;
export default residueReturnNitrogenBasisTool;
