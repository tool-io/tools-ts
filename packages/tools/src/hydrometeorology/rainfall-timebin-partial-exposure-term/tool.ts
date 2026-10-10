import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly binRainDepth: number;
  readonly binDuration: number;
  readonly observedDuration: number;
};
export type Output = {
  readonly representedRainDepth: number;
  readonly exposureFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    binRainDepth: { type: "number", minimum: 0 },
    binDuration: { type: "number", exclusiveMinimum: 0 },
    observedDuration: { type: "number", minimum: 0 },
  },
  required: ["binRainDepth", "binDuration", "observedDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    representedRainDepth: { type: "number" },
    exposureFraction: { type: "number" },
  },
  required: ["representedRainDepth", "exposureFraction"],
} as const;
/** Allocate supplied rainfall-bin depth to explicit observed duration under a uniform-within-bin intensity assumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { binRainDepth, binDuration, observedDuration } = request;
  const compute = (): Output => {
    H.domain(binRainDepth >= 0, "binRainDepth");
    (H.domain(Number.isFinite(binDuration) && binDuration > 0, "binDuration"),
      binDuration);
    H.domain(
      observedDuration >= 0 && observedDuration <= binDuration,
      "observedDuration",
    );
    return {
      representedRainDepth: binRainDepth * (observedDuration / binDuration),
      exposureFraction: observedDuration / binDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { binRainDepth: 12, binDuration: 60, observedDuration: 15 },
  output: { representedRainDepth: 3, exposureFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const rainfallTimebinPartialExposureTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/rainfall-timebin-partial-exposure-term",
    title: "Rainfall Timebin Partial Exposure Term Tool",
    description:
      "Allocate supplied rainfall-bin depth to explicit observed duration under a uniform-within-bin intensity assumption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        binRainDepth: { type: "number", minimum: 0 },
        binDuration: { type: "number", exclusiveMinimum: 0 },
        observedDuration: { type: "number", minimum: 0 },
      },
      required: ["binRainDepth", "binDuration", "observedDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        representedRainDepth: { type: "number" },
        exposureFraction: { type: "number" },
      },
      required: ["representedRainDepth", "exposureFraction"],
    },
    ports: {
      inputs: [
        {
          id: "binRainDepth",
          label: "Bin Rain Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "binDuration",
          label: "Bin Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedDuration",
          label: "Observed Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "representedRainDepth",
          label: "Represented Rain Depth",
          valueType: { type: "number" },
        },
        {
          id: "exposureFraction",
          label: "Exposure Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rainfallTimebinPartialExposureTermTool.execute;
export default rainfallTimebinPartialExposureTermTool;
