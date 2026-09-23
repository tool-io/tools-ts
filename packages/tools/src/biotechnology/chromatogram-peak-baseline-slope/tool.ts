import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startTime: number;
  readonly endTime: number;
  readonly startBaseline: number;
  readonly endBaseline: number;
  readonly peakTime: number;
  readonly observedHeight: number;
};
export type Output = {
  readonly slope: number;
  readonly baselineAtPeak: number;
  readonly correctedHeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startTime: { type: "number" },
    endTime: { type: "number" },
    startBaseline: { type: "number" },
    endBaseline: { type: "number" },
    peakTime: { type: "number" },
    observedHeight: { type: "number" },
  },
  required: [
    "startTime",
    "endTime",
    "startBaseline",
    "endBaseline",
    "peakTime",
    "observedHeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slope: { type: "number" },
    baselineAtPeak: { type: "number" },
    correctedHeight: { type: "number" },
  },
  required: ["slope", "baselineAtPeak", "correctedHeight"],
} as const;
/** Calculate chromatogram peak baseline slope from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    startTime,
    endTime,
    startBaseline,
    endBaseline,
    peakTime,
    observedHeight,
  } = request;
  const compute = (): Output => {
    H.domain(
      endTime > startTime && peakTime >= startTime && peakTime <= endTime,
    );
    return {
      slope: (endBaseline - startBaseline) / (endTime - startTime),
      baselineAtPeak:
        startBaseline +
        ((endBaseline - startBaseline) * (peakTime - startTime)) /
          (endTime - startTime),
      correctedHeight:
        observedHeight -
        startBaseline -
        ((endBaseline - startBaseline) * (peakTime - startTime)) /
          (endTime - startTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startTime: 0,
    endTime: 10,
    startBaseline: 2,
    endBaseline: 4,
    peakTime: 5,
    observedHeight: 12,
  },
  output: { slope: 0.2, baselineAtPeak: 3, correctedHeight: 9 },
} satisfies ToolExample<Input, Output>;
export const chromatogramPeakBaselineSlopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/chromatogram-peak-baseline-slope",
    title: "Chromatogram Peak Baseline Slope Tool",
    description:
      "Calculate chromatogram peak baseline slope from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startTime: { type: "number" },
        endTime: { type: "number" },
        startBaseline: { type: "number" },
        endBaseline: { type: "number" },
        peakTime: { type: "number" },
        observedHeight: { type: "number" },
      },
      required: [
        "startTime",
        "endTime",
        "startBaseline",
        "endBaseline",
        "peakTime",
        "observedHeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slope: { type: "number" },
        baselineAtPeak: { type: "number" },
        correctedHeight: { type: "number" },
      },
      required: ["slope", "baselineAtPeak", "correctedHeight"],
    },
    ports: {
      inputs: [
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
          id: "startBaseline",
          label: "Start Baseline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endBaseline",
          label: "End Baseline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "peakTime",
          label: "Peak Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedHeight",
          label: "Observed Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "slope", label: "Slope", valueType: { type: "number" } },
        {
          id: "baselineAtPeak",
          label: "Baseline At Peak",
          valueType: { type: "number" },
        },
        {
          id: "correctedHeight",
          label: "Corrected Height",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = chromatogramPeakBaselineSlopeTool.execute;
export default chromatogramPeakBaselineSlopeTool;
