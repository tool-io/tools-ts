import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly thermalEnergy: number;
  readonly positionVariance: number;
  readonly measurementVariance: number;
};
export type Output = {
  readonly correctedVariance: number;
  readonly stiffness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    thermalEnergy: { type: "number", minimum: 0 },
    positionVariance: { type: "number" },
    measurementVariance: { type: "number", minimum: 0 },
  },
  required: ["thermalEnergy", "positionVariance", "measurementVariance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedVariance: { type: "number" },
    stiffness: { type: "number" },
  },
  required: ["correctedVariance", "stiffness"],
} as const;
/** Equipartition stiffness using an explicit independent additive position-noise variance correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { thermalEnergy, positionVariance, measurementVariance } = request;
  const compute = (): Output => {
    H.domain(
      thermalEnergy >= 0 &&
        measurementVariance >= 0 &&
        positionVariance > measurementVariance,
    );
    return {
      correctedVariance: positionVariance - measurementVariance,
      stiffness: thermalEnergy / (positionVariance - measurementVariance),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { thermalEnergy: 4, positionVariance: 10, measurementVariance: 2 },
  output: { correctedVariance: 8, stiffness: 0.5 },
} satisfies ToolExample<Input, Output>;
export const opticalTrapStiffnessVarianceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/optical-trap-stiffness-variance-term",
    title: "Optical Trap Stiffness Variance Term Tool",
    description:
      "Equipartition stiffness using an explicit independent additive position-noise variance correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        thermalEnergy: { type: "number", minimum: 0 },
        positionVariance: { type: "number" },
        measurementVariance: { type: "number", minimum: 0 },
      },
      required: ["thermalEnergy", "positionVariance", "measurementVariance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedVariance: { type: "number" },
        stiffness: { type: "number" },
      },
      required: ["correctedVariance", "stiffness"],
    },
    ports: {
      inputs: [
        {
          id: "thermalEnergy",
          label: "Thermal Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positionVariance",
          label: "Position Variance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measurementVariance",
          label: "Measurement Variance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedVariance",
          label: "Corrected Variance",
          valueType: { type: "number" },
        },
        { id: "stiffness", label: "Stiffness", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = opticalTrapStiffnessVarianceTermTool.execute;
export default opticalTrapStiffnessVarianceTermTool;
