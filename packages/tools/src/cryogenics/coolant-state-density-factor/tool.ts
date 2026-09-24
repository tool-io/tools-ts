import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDensity: number;
  readonly secondDensity: number;
  readonly firstVolume: number;
};
export type Output = {
  readonly densityRatio: number;
  readonly conservedMass: number;
  readonly equivalentSecondVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDensity: { type: "number", exclusiveMinimum: 0 },
    secondDensity: { type: "number", exclusiveMinimum: 0 },
    firstVolume: { type: "number", minimum: 0 },
  },
  required: ["firstDensity", "secondDensity", "firstVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    densityRatio: { type: "number" },
    conservedMass: { type: "number" },
    equivalentSecondVolume: { type: "number" },
  },
  required: ["densityRatio", "conservedMass", "equivalentSecondVolume"],
} as const;
/** Compare supplied state densities under explicit mass conservation; no material-property lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDensity, secondDensity, firstVolume } = request;
  const compute = (): Output => {
    H.positive(firstDensity);
    H.positive(secondDensity);
    H.domain(firstVolume >= 0);
    return {
      densityRatio: firstDensity / secondDensity,
      conservedMass: firstDensity * firstVolume,
      equivalentSecondVolume: firstVolume * (firstDensity / secondDensity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDensity: 2, secondDensity: 4, firstVolume: 10 },
  output: { densityRatio: 0.5, conservedMass: 20, equivalentSecondVolume: 5 },
} satisfies ToolExample<Input, Output>;
export const coolantStateDensityFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/coolant-state-density-factor",
    title: "Coolant State Density Factor Tool",
    description:
      "Compare supplied state densities under explicit mass conservation; no material-property lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDensity: { type: "number", exclusiveMinimum: 0 },
        secondDensity: { type: "number", exclusiveMinimum: 0 },
        firstVolume: { type: "number", minimum: 0 },
      },
      required: ["firstDensity", "secondDensity", "firstVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        densityRatio: { type: "number" },
        conservedMass: { type: "number" },
        equivalentSecondVolume: { type: "number" },
      },
      required: ["densityRatio", "conservedMass", "equivalentSecondVolume"],
    },
    ports: {
      inputs: [
        {
          id: "firstDensity",
          label: "First Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDensity",
          label: "Second Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstVolume",
          label: "First Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "densityRatio",
          label: "Density Ratio",
          valueType: { type: "number" },
        },
        {
          id: "conservedMass",
          label: "Conserved Mass",
          valueType: { type: "number" },
        },
        {
          id: "equivalentSecondVolume",
          label: "Equivalent Second Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = coolantStateDensityFactorTool.execute;
export default coolantStateDensityFactorTool;
