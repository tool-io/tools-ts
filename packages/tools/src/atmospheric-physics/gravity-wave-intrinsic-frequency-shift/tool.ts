import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedFrequency: number;
  readonly horizontalWavenumber: number;
  readonly backgroundVelocity: number;
};
export type Output = {
  readonly intrinsicFrequency: number;
  readonly dopplerShift: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedFrequency: { type: "number" },
    horizontalWavenumber: { type: "number" },
    backgroundVelocity: { type: "number" },
  },
  required: ["observedFrequency", "horizontalWavenumber", "backgroundVelocity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intrinsicFrequency: { type: "number" },
    dopplerShift: { type: "number" },
  },
  required: ["intrinsicFrequency", "dopplerShift"],
} as const;
/** Consistent angular-frequency/wavenumber convention with a signed scalar background flow. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedFrequency, horizontalWavenumber, backgroundVelocity } =
    request;
  const compute = (): Output => {
    return {
      intrinsicFrequency:
        observedFrequency - horizontalWavenumber * backgroundVelocity,
      dopplerShift: horizontalWavenumber * backgroundVelocity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedFrequency: 5,
    horizontalWavenumber: 0.2,
    backgroundVelocity: 10,
  },
  output: { intrinsicFrequency: 3, dopplerShift: 2 },
} satisfies ToolExample<Input, Output>;
export const gravityWaveIntrinsicFrequencyShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/gravity-wave-intrinsic-frequency-shift",
    title: "Gravity Wave Intrinsic Frequency Shift Tool",
    description:
      "Consistent angular-frequency/wavenumber convention with a signed scalar background flow.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedFrequency: { type: "number" },
        horizontalWavenumber: { type: "number" },
        backgroundVelocity: { type: "number" },
      },
      required: [
        "observedFrequency",
        "horizontalWavenumber",
        "backgroundVelocity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intrinsicFrequency: { type: "number" },
        dopplerShift: { type: "number" },
      },
      required: ["intrinsicFrequency", "dopplerShift"],
    },
    ports: {
      inputs: [
        {
          id: "observedFrequency",
          label: "Observed Frequency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "horizontalWavenumber",
          label: "Horizontal Wavenumber",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "backgroundVelocity",
          label: "Background Velocity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "intrinsicFrequency",
          label: "Intrinsic Frequency",
          valueType: { type: "number" },
        },
        {
          id: "dopplerShift",
          label: "Doppler Shift",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gravityWaveIntrinsicFrequencyShiftTool.execute;
export default gravityWaveIntrinsicFrequencyShiftTool;
