import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPressure: number;
  readonly secondPressure: number;
  readonly startTime: number;
  readonly endTime: number;
  readonly baselinePressure: number;
};
export type Output = {
  readonly rawPressureTime: number;
  readonly aboveBaselinePressureTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPressure: { type: "number" },
    secondPressure: { type: "number" },
    startTime: { type: "number" },
    endTime: { type: "number" },
    baselinePressure: { type: "number" },
  },
  required: [
    "firstPressure",
    "secondPressure",
    "startTime",
    "endTime",
    "baselinePressure",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawPressureTime: { type: "number" },
    aboveBaselinePressureTime: { type: "number" },
  },
  required: ["rawPressureTime", "aboveBaselinePressureTime"],
} as const;
/** One signed trapezoidal pressure-time panel above an explicit baseline, without beat segmentation or a clinical waveform index. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstPressure,
    secondPressure,
    startTime,
    endTime,
    baselinePressure,
  } = request;
  const compute = (): Output => {
    H.domain(endTime >= startTime);
    return {
      rawPressureTime:
        ((firstPressure + secondPressure) * (endTime - startTime)) / 2,
      aboveBaselinePressureTime:
        ((firstPressure + secondPressure) / 2 - baselinePressure) *
        (endTime - startTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstPressure: 80,
    secondPressure: 120,
    startTime: 0,
    endTime: 0.5,
    baselinePressure: 70,
  },
  output: { rawPressureTime: 50, aboveBaselinePressureTime: 15 },
} satisfies ToolExample<Input, Output>;
export const cardiacWaveformPressureTimeOnePanelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cardiology/cardiac-waveform-pressure-time-one-panel",
      title: "Cardiac Waveform Pressure Time One Panel Tool",
      description:
        "One signed trapezoidal pressure-time panel above an explicit baseline, without beat segmentation or a clinical waveform index.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstPressure: { type: "number" },
          secondPressure: { type: "number" },
          startTime: { type: "number" },
          endTime: { type: "number" },
          baselinePressure: { type: "number" },
        },
        required: [
          "firstPressure",
          "secondPressure",
          "startTime",
          "endTime",
          "baselinePressure",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rawPressureTime: { type: "number" },
          aboveBaselinePressureTime: { type: "number" },
        },
        required: ["rawPressureTime", "aboveBaselinePressureTime"],
      },
      ports: {
        inputs: [
          {
            id: "firstPressure",
            label: "First Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondPressure",
            label: "Second Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "startTime",
            label: "Start Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "endTime",
            label: "End Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "baselinePressure",
            label: "Baseline Pressure",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "rawPressureTime",
            label: "Raw Pressure Time",
            valueType: { type: "number" },
          },
          {
            id: "aboveBaselinePressureTime",
            label: "Above Baseline Pressure Time",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cardiacWaveformPressureTimeOnePanelTool.execute;
export default cardiacWaveformPressureTimeOnePanelTool;
