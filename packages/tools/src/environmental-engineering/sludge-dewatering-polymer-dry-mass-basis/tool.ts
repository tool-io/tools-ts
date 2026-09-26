import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sludgeMass: number;
  readonly solidsFraction: number;
  readonly dosePerDryMass: number;
  readonly solutionActiveFraction: number;
};
export type Output = {
  readonly dryMass: number;
  readonly activePolymer: number;
  readonly solutionMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sludgeMass: { type: "number", minimum: 0 },
    solidsFraction: { type: "number", minimum: 0, maximum: 1 },
    dosePerDryMass: { type: "number", minimum: 0 },
    solutionActiveFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: [
    "sludgeMass",
    "solidsFraction",
    "dosePerDryMass",
    "solutionActiveFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number" },
    activePolymer: { type: "number" },
    solutionMass: { type: "number" },
  },
  required: ["dryMass", "activePolymer", "solutionMass"],
} as const;
/** Calculate sludge dewatering polymer dry mass basis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sludgeMass, solidsFraction, dosePerDryMass, solutionActiveFraction } =
    request;
  const compute = (): Output => {
    H.domain(
      sludgeMass >= 0 &&
        dosePerDryMass >= 0 &&
        solutionActiveFraction > 0 &&
        solutionActiveFraction <= 1,
    );
    H.probability(solidsFraction);
    return {
      dryMass: sludgeMass * solidsFraction,
      activePolymer: sludgeMass * solidsFraction * dosePerDryMass,
      solutionMass:
        (sludgeMass * solidsFraction * dosePerDryMass) / solutionActiveFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sludgeMass: 1000,
    solidsFraction: 0.04,
    dosePerDryMass: 0.005,
    solutionActiveFraction: 0.01,
  },
  output: { dryMass: 40, activePolymer: 0.2, solutionMass: 20 },
} satisfies ToolExample<Input, Output>;
export const sludgeDewateringPolymerDryMassBasisTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-engineering/sludge-dewatering-polymer-dry-mass-basis",
      title: "Sludge Dewatering Polymer Dry Mass Basis Tool",
      description:
        "Calculate sludge dewatering polymer dry mass basis from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sludgeMass: { type: "number", minimum: 0 },
          solidsFraction: { type: "number", minimum: 0, maximum: 1 },
          dosePerDryMass: { type: "number", minimum: 0 },
          solutionActiveFraction: {
            type: "number",
            exclusiveMinimum: 0,
            maximum: 1,
          },
        },
        required: [
          "sludgeMass",
          "solidsFraction",
          "dosePerDryMass",
          "solutionActiveFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dryMass: { type: "number" },
          activePolymer: { type: "number" },
          solutionMass: { type: "number" },
        },
        required: ["dryMass", "activePolymer", "solutionMass"],
      },
      ports: {
        inputs: [
          {
            id: "sludgeMass",
            label: "Sludge Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "solidsFraction",
            label: "Solids Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dosePerDryMass",
            label: "Dose Per Dry Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "solutionActiveFraction",
            label: "Solution Active Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
          {
            id: "activePolymer",
            label: "Active Polymer",
            valueType: { type: "number" },
          },
          {
            id: "solutionMass",
            label: "Solution Mass",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = sludgeDewateringPolymerDryMassBasisTool.execute;
export default sludgeDewateringPolymerDryMassBasisTool;
