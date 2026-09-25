import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nitrogenMass: number;
  readonly conversionFactor: number;
  readonly nonproteinNitrogen: number;
};
export type Output = {
  readonly netNitrogen: number;
  readonly estimatedProtein: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nitrogenMass: { type: "number" },
    conversionFactor: { type: "number", exclusiveMinimum: 0 },
    nonproteinNitrogen: { type: "number", minimum: 0 },
  },
  required: ["nitrogenMass", "conversionFactor", "nonproteinNitrogen"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netNitrogen: { type: "number" },
    estimatedProtein: { type: "number" },
  },
  required: ["netNitrogen", "estimatedProtein"],
} as const;
/** Calculate protein nitrogen explicit factor term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nitrogenMass, conversionFactor, nonproteinNitrogen } = request;
  const compute = (): Output => {
    H.domain(nonproteinNitrogen >= 0 && nitrogenMass >= nonproteinNitrogen);
    H.positive(conversionFactor);
    return {
      netNitrogen: nitrogenMass - nonproteinNitrogen,
      estimatedProtein: (nitrogenMass - nonproteinNitrogen) * conversionFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nitrogenMass: 10, conversionFactor: 6.25, nonproteinNitrogen: 2 },
  output: { netNitrogen: 8, estimatedProtein: 50 },
} satisfies ToolExample<Input, Output>;
export const proteinNitrogenExplicitFactorTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/protein-nitrogen-explicit-factor-term",
    title: "Protein Nitrogen Explicit Factor Term Tool",
    description:
      "Calculate protein nitrogen explicit factor term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nitrogenMass: { type: "number" },
        conversionFactor: { type: "number", exclusiveMinimum: 0 },
        nonproteinNitrogen: { type: "number", minimum: 0 },
      },
      required: ["nitrogenMass", "conversionFactor", "nonproteinNitrogen"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netNitrogen: { type: "number" },
        estimatedProtein: { type: "number" },
      },
      required: ["netNitrogen", "estimatedProtein"],
    },
    ports: {
      inputs: [
        {
          id: "nitrogenMass",
          label: "Nitrogen Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "conversionFactor",
          label: "Conversion Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nonproteinNitrogen",
          label: "Nonprotein Nitrogen",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netNitrogen",
          label: "Net Nitrogen",
          valueType: { type: "number" },
        },
        {
          id: "estimatedProtein",
          label: "Estimated Protein",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = proteinNitrogenExplicitFactorTermTool.execute;
export default proteinNitrogenExplicitFactorTermTool;
