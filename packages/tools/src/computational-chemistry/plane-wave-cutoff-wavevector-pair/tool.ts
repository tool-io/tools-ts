import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cutoffEnergy: number;
  readonly suppliedHbar: number;
  readonly particleMass: number;
};
export type Output = { readonly maximumWavevector: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cutoffEnergy: { type: "number", minimum: 0 },
    suppliedHbar: { type: "number", exclusiveMinimum: 0 },
    particleMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["cutoffEnergy", "suppliedHbar", "particleMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { maximumWavevector: { type: "number" } },
  required: ["maximumWavevector"],
} as const;
/** Solve E=hbar² k²/(2m) for a supplied nonnegative plane-wave cutoff using explicit compatible constants. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cutoffEnergy, suppliedHbar, particleMass } = request;
  const compute = (): Output => {
    H.domain(cutoffEnergy >= 0, "cutoffEnergy");
    (H.domain(
      Number.isFinite(suppliedHbar) && suppliedHbar > 0,
      "suppliedHbar",
    ),
      suppliedHbar);
    (H.domain(
      Number.isFinite(particleMass) && particleMass > 0,
      "particleMass",
    ),
      particleMass);
    return {
      maximumWavevector:
        Math.sqrt(2 * particleMass * cutoffEnergy) / suppliedHbar,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cutoffEnergy: 8, suppliedHbar: 2, particleMass: 1 },
  output: { maximumWavevector: 2 },
} satisfies ToolExample<Input, Output>;
export const planeWaveCutoffWavevectorPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "computational-chemistry",
        "computational chemistry",
        "chemistry",
      ],
      keywords: ["computational chemistry", "chemistry"],
    },
    id: "computational-chemistry/plane-wave-cutoff-wavevector-pair",
    title: "Plane Wave Cutoff Wavevector Pair",
    description:
      "Solve E=hbar² k²/(2m) for a supplied nonnegative plane-wave cutoff using explicit compatible constants.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cutoffEnergy: { type: "number", minimum: 0 },
        suppliedHbar: { type: "number", exclusiveMinimum: 0 },
        particleMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["cutoffEnergy", "suppliedHbar", "particleMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { maximumWavevector: { type: "number" } },
      required: ["maximumWavevector"],
    },
    ports: {
      inputs: [
        {
          id: "cutoffEnergy",
          label: "Cutoff Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedHbar",
          label: "Supplied Hbar",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "particleMass",
          label: "Particle Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "maximumWavevector",
          label: "Maximum Wavevector",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = planeWaveCutoffWavevectorPairTool.execute;
export default planeWaveCutoffWavevectorPairTool;
