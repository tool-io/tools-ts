import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftState: number;
  readonly rightState: number;
  readonly leftFlux: number;
  readonly rightFlux: number;
  readonly maxWaveSpeed: number;
};
export type Output = {
  readonly centralFlux: number;
  readonly dissipation: number;
  readonly numericalFlux: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftState: { type: "number" },
    rightState: { type: "number" },
    leftFlux: { type: "number" },
    rightFlux: { type: "number" },
    maxWaveSpeed: { type: "number", minimum: 0 },
  },
  required: [
    "leftState",
    "rightState",
    "leftFlux",
    "rightFlux",
    "maxWaveSpeed",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centralFlux: { type: "number" },
    dissipation: { type: "number" },
    numericalFlux: { type: "number" },
  },
  required: ["centralFlux", "dissipation", "numericalFlux"],
} as const;
/** Rusanov/local Lax-Friedrichs flux with a caller-established nonnegative wave-speed bound. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftState, rightState, leftFlux, rightFlux, maxWaveSpeed } = request;
  const compute = (): Output => {
    H.domain(maxWaveSpeed >= 0);
    return {
      centralFlux: (leftFlux + rightFlux) / 2,
      dissipation: (maxWaveSpeed * (rightState - leftState)) / 2,
      numericalFlux:
        (leftFlux + rightFlux - maxWaveSpeed * (rightState - leftState)) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    leftState: 1,
    rightState: 3,
    leftFlux: 2,
    rightFlux: 6,
    maxWaveSpeed: 2,
  },
  output: { centralFlux: 4, dissipation: 2, numericalFlux: 2 },
} satisfies ToolExample<Input, Output>;
export const riemannFluxSuppliedWaveSpeedFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/riemann-flux-supplied-wave-speed-factor",
    title: "Riemann Flux Supplied Wave Speed Factor Tool",
    description:
      "Rusanov/local Lax-Friedrichs flux with a caller-established nonnegative wave-speed bound.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftState: { type: "number" },
        rightState: { type: "number" },
        leftFlux: { type: "number" },
        rightFlux: { type: "number" },
        maxWaveSpeed: { type: "number", minimum: 0 },
      },
      required: [
        "leftState",
        "rightState",
        "leftFlux",
        "rightFlux",
        "maxWaveSpeed",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centralFlux: { type: "number" },
        dissipation: { type: "number" },
        numericalFlux: { type: "number" },
      },
      required: ["centralFlux", "dissipation", "numericalFlux"],
    },
    ports: {
      inputs: [
        {
          id: "leftState",
          label: "Left State",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightState",
          label: "Right State",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftFlux",
          label: "Left Flux",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightFlux",
          label: "Right Flux",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maxWaveSpeed",
          label: "Max Wave Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "centralFlux",
          label: "Central Flux",
          valueType: { type: "number" },
        },
        {
          id: "dissipation",
          label: "Dissipation",
          valueType: { type: "number" },
        },
        {
          id: "numericalFlux",
          label: "Numerical Flux",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = riemannFluxSuppliedWaveSpeedFactorTool.execute;
export default riemannFluxSuppliedWaveSpeedFactorTool;
