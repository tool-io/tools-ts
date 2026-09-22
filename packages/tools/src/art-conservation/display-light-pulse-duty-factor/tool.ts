import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly onIlluminance: number;
  readonly offIlluminance: number;
  readonly onSeconds: number;
  readonly periodSeconds: number;
  readonly exposureHours: number;
};
export type Output = {
  readonly meanIlluminance: number;
  readonly exposure: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onIlluminance: { type: "number", minimum: 0 },
    offIlluminance: { type: "number", minimum: 0 },
    onSeconds: { type: "number", minimum: 0 },
    periodSeconds: { type: "number", exclusiveMinimum: 0 },
    exposureHours: { type: "number", minimum: 0 },
  },
  required: [
    "onIlluminance",
    "offIlluminance",
    "onSeconds",
    "periodSeconds",
    "exposureHours",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanIlluminance: { type: "number" },
    exposure: { type: "number" },
  },
  required: ["meanIlluminance", "exposure"],
} as const;
/** Periodic illuminance averaging and lux-hour exposure, without a material-specific preservation limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    onIlluminance,
    offIlluminance,
    onSeconds,
    periodSeconds,
    exposureHours,
  } = request;
  const compute = (): Output => {
    H.domain(
      onIlluminance >= 0 &&
        offIlluminance >= 0 &&
        onSeconds >= 0 &&
        periodSeconds > 0 &&
        onSeconds <= periodSeconds &&
        exposureHours >= 0,
    );
    return {
      meanIlluminance:
        (onIlluminance * onSeconds +
          offIlluminance * (periodSeconds - onSeconds)) /
        periodSeconds,
      exposure:
        ((onIlluminance * onSeconds +
          offIlluminance * (periodSeconds - onSeconds)) /
          periodSeconds) *
        exposureHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    onIlluminance: 100,
    offIlluminance: 0,
    onSeconds: 1,
    periodSeconds: 4,
    exposureHours: 8,
  },
  output: { meanIlluminance: 25, exposure: 200 },
} satisfies ToolExample<Input, Output>;
export const displayLightPulseDutyFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/display-light-pulse-duty-factor",
    title: "Display Light Pulse Duty Factor Tool",
    description:
      "Periodic illuminance averaging and lux-hour exposure, without a material-specific preservation limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        onIlluminance: { type: "number", minimum: 0 },
        offIlluminance: { type: "number", minimum: 0 },
        onSeconds: { type: "number", minimum: 0 },
        periodSeconds: { type: "number", exclusiveMinimum: 0 },
        exposureHours: { type: "number", minimum: 0 },
      },
      required: [
        "onIlluminance",
        "offIlluminance",
        "onSeconds",
        "periodSeconds",
        "exposureHours",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanIlluminance: { type: "number" },
        exposure: { type: "number" },
      },
      required: ["meanIlluminance", "exposure"],
    },
    ports: {
      inputs: [
        {
          id: "onIlluminance",
          label: "On Illuminance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offIlluminance",
          label: "Off Illuminance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "onSeconds",
          label: "On Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periodSeconds",
          label: "Period Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exposureHours",
          label: "Exposure Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "meanIlluminance",
          label: "Mean Illuminance",
          valueType: { type: "number" },
        },
        { id: "exposure", label: "Exposure", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = displayLightPulseDutyFactorTool.execute;
export default displayLightPulseDutyFactorTool;
