import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly absorptionCoefficient: number;
  readonly pathLength: number;
};
export type Output = {
  readonly opticalDepth: number;
  readonly transmission: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absorptionCoefficient: { type: "number", minimum: 0 },
    pathLength: { type: "number", minimum: 0 },
  },
  required: ["absorptionCoefficient", "pathLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opticalDepth: { type: "number" },
    transmission: { type: "number" },
  },
  required: ["opticalDepth", "transmission"],
} as const;
/** Calculate homogeneous-path Beer transmission from supplied nonnegative absorption coefficient and length, excluding scattering and emission. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { absorptionCoefficient, pathLength } = request;
  const compute = (): Output => {
    H.domain(absorptionCoefficient >= 0, "absorptionCoefficient");
    H.domain(pathLength >= 0, "pathLength");
    return {
      opticalDepth: absorptionCoefficient * pathLength,
      transmission: Math.exp(-absorptionCoefficient * pathLength),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { absorptionCoefficient: 0.2, pathLength: 5 },
  output: { opticalDepth: 1, transmission: 0.36787944117144233 },
} satisfies ToolExample<Input, Output>;
export const radiativeAbsorptionPathTransmissionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["atmospheric-physics", "atmospheric physics", "physics"],
        keywords: ["atmospheric physics", "physics"],
      },
      id: "atmospheric-physics/radiative-absorption-path-transmission",
      title: "Radiative Absorption Path Transmission",
      description:
        "Calculate homogeneous-path Beer transmission from supplied nonnegative absorption coefficient and length, excluding scattering and emission.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          absorptionCoefficient: { type: "number", minimum: 0 },
          pathLength: { type: "number", minimum: 0 },
        },
        required: ["absorptionCoefficient", "pathLength"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opticalDepth: { type: "number" },
          transmission: { type: "number" },
        },
        required: ["opticalDepth", "transmission"],
      },
      ports: {
        inputs: [
          {
            id: "absorptionCoefficient",
            label: "Absorption Coefficient",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pathLength",
            label: "Path Length",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "opticalDepth",
            label: "Optical Depth",
            valueType: { type: "number" },
          },
          {
            id: "transmission",
            label: "Transmission",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = radiativeAbsorptionPathTransmissionTool.execute;
export default radiativeAbsorptionPathTransmissionTool;
