import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roverReading: number;
  readonly baseReading: number;
  readonly baseReference: number;
};
export type Output = {
  readonly correctedRover: number;
  readonly baseDrift: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roverReading: { type: "number" },
    baseReading: { type: "number" },
    baseReference: { type: "number" },
  },
  required: ["roverReading", "baseReading", "baseReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedRover: { type: "number" },
    baseDrift: { type: "number" },
  },
  required: ["correctedRover", "baseDrift"],
} as const;
/** Remove an explicitly measured base-station drift from a compatible rover magnetic reading. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roverReading, baseReading, baseReference } = request;
  const compute = (): Output => {
    return {
      correctedRover: roverReading - (baseReading - baseReference),
      baseDrift: baseReading - baseReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { roverReading: 50020, baseReading: 50005, baseReference: 50000 },
  output: { correctedRover: 50015, baseDrift: 5 },
} satisfies ToolExample<Input, Output>;
export const magneticBaseRoverDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geophysics", "physics"],
      keywords: ["geophysics", "physics"],
    },
    id: "geophysics/magnetic-base-rover-difference",
    title: "Magnetic Base Rover Difference",
    description:
      "Remove an explicitly measured base-station drift from a compatible rover magnetic reading.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roverReading: { type: "number" },
        baseReading: { type: "number" },
        baseReference: { type: "number" },
      },
      required: ["roverReading", "baseReading", "baseReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedRover: { type: "number" },
        baseDrift: { type: "number" },
      },
      required: ["correctedRover", "baseDrift"],
    },
    ports: {
      inputs: [
        {
          id: "roverReading",
          label: "Rover Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseReading",
          label: "Base Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseReference",
          label: "Base Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedRover",
          label: "Corrected Rover",
          valueType: { type: "number" },
        },
        { id: "baseDrift", label: "Base Drift", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = magneticBaseRoverDifferenceTool.execute;
export default magneticBaseRoverDifferenceTool;
