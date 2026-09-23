import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volume: number;
  readonly fiberLength: number;
  readonly specificTension: number;
  readonly pennationRadians: number;
};
export type Output = {
  readonly pcsa: number;
  readonly fiberForce: number;
  readonly tendonForce: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "number", minimum: 0 },
    fiberLength: { type: "number", exclusiveMinimum: 0 },
    specificTension: { type: "number", minimum: 0 },
    pennationRadians: { type: "number", minimum: 0 },
  },
  required: ["volume", "fiberLength", "specificTension", "pennationRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pcsa: { type: "number" },
    fiberForce: { type: "number" },
    tendonForce: { type: "number" },
  },
  required: ["pcsa", "fiberForce", "tendonForce"],
} as const;
/** PCSA=volume/fiber length; apply pennation only once when projecting fiber force along the tendon. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volume, fiberLength, specificTension, pennationRadians } = request;
  const compute = (): Output => {
    H.domain(
      volume >= 0 &&
        specificTension >= 0 &&
        pennationRadians >= 0 &&
        pennationRadians <= Math.PI / 2,
    );
    H.positive(fiberLength);
    return {
      pcsa: volume / fiberLength,
      fiberForce: (volume * specificTension) / fiberLength,
      tendonForce:
        (volume * specificTension * Math.cos(pennationRadians)) / fiberLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    volume: 100,
    fiberLength: 10,
    specificTension: 3,
    pennationRadians: 0,
  },
  output: { pcsa: 10, fiberForce: 30, tendonForce: 30 },
} satisfies ToolExample<Input, Output>;
export const musclePhysiologicalCrossSectionForceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biomechanics/muscle-physiological-cross-section-force-term",
      title: "Muscle Physiological Cross Section Force Term Tool",
      description:
        "PCSA=volume/fiber length; apply pennation only once when projecting fiber force along the tendon.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          volume: { type: "number", minimum: 0 },
          fiberLength: { type: "number", exclusiveMinimum: 0 },
          specificTension: { type: "number", minimum: 0 },
          pennationRadians: { type: "number", minimum: 0 },
        },
        required: [
          "volume",
          "fiberLength",
          "specificTension",
          "pennationRadians",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pcsa: { type: "number" },
          fiberForce: { type: "number" },
          tendonForce: { type: "number" },
        },
        required: ["pcsa", "fiberForce", "tendonForce"],
      },
      ports: {
        inputs: [
          {
            id: "volume",
            label: "Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fiberLength",
            label: "Fiber Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "specificTension",
            label: "Specific Tension",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pennationRadians",
            label: "Pennation Radians",
            required: true,
            valueType: { type: "number", unit: "rad" },
          },
        ],
        outputs: [
          { id: "pcsa", label: "Pcsa", valueType: { type: "number" } },
          {
            id: "fiberForce",
            label: "Fiber Force",
            valueType: { type: "number" },
          },
          {
            id: "tendonForce",
            label: "Tendon Force",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = musclePhysiologicalCrossSectionForceTermTool.execute;
export default musclePhysiologicalCrossSectionForceTermTool;
