import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flightSpeed: number;
  readonly wingLength: number;
  readonly wingbeatHz: number;
};
export type Output = {
  readonly wingLengthsPerSecond: number;
  readonly advancePerBeat: number;
  readonly advanceRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flightSpeed: { type: "number", minimum: 0 },
    wingLength: { type: "number", exclusiveMinimum: 0 },
    wingbeatHz: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["flightSpeed", "wingLength", "wingbeatHz"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wingLengthsPerSecond: { type: "number" },
    advancePerBeat: { type: "number" },
    advanceRatio: { type: "number" },
  },
  required: ["wingLengthsPerSecond", "advancePerBeat", "advanceRatio"],
} as const;
/** Flight speed normalized by wing length and beat frequency; advanceRatio here is U/(fL), without a pi or stroke-amplitude factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flightSpeed, wingLength, wingbeatHz } = request;
  const compute = (): Output => {
    H.domain(flightSpeed >= 0);
    H.positive(wingLength);
    H.positive(wingbeatHz);
    return {
      wingLengthsPerSecond: flightSpeed / wingLength,
      advancePerBeat: flightSpeed / wingbeatHz,
      advanceRatio: flightSpeed / (wingLength * wingbeatHz),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flightSpeed: 2, wingLength: 0.01, wingbeatHz: 100 },
  output: { wingLengthsPerSecond: 200, advancePerBeat: 0.02, advanceRatio: 2 },
} satisfies ToolExample<Input, Output>;
export const insectFlightSpeedWingLengthFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/insect-flight-speed-wing-length-factor",
    title: "Insect Flight Speed Wing Length Factor Tool",
    description:
      "Flight speed normalized by wing length and beat frequency; advanceRatio here is U/(fL), without a pi or stroke-amplitude factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flightSpeed: { type: "number", minimum: 0 },
        wingLength: { type: "number", exclusiveMinimum: 0 },
        wingbeatHz: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["flightSpeed", "wingLength", "wingbeatHz"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wingLengthsPerSecond: { type: "number" },
        advancePerBeat: { type: "number" },
        advanceRatio: { type: "number" },
      },
      required: ["wingLengthsPerSecond", "advancePerBeat", "advanceRatio"],
    },
    ports: {
      inputs: [
        {
          id: "flightSpeed",
          label: "Flight Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wingLength",
          label: "Wing Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wingbeatHz",
          label: "Wingbeat Hz",
          required: true,
          valueType: { type: "number", unit: "Hz" },
        },
      ],
      outputs: [
        {
          id: "wingLengthsPerSecond",
          label: "Wing Lengths Per Second",
          valueType: { type: "number" },
        },
        {
          id: "advancePerBeat",
          label: "Advance Per Beat",
          valueType: { type: "number" },
        },
        {
          id: "advanceRatio",
          label: "Advance Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = insectFlightSpeedWingLengthFactorTool.execute;
export default insectFlightSpeedWingLengthFactorTool;
