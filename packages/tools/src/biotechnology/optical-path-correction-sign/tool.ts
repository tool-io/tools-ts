import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly blank: number;
  readonly pathLength: number;
  readonly referencePath: number;
};
export type Output = {
  readonly blankCorrected: number;
  readonly pathNormalized: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    blank: { type: "number" },
    pathLength: { type: "number", exclusiveMinimum: 0 },
    referencePath: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observed", "blank", "pathLength", "referencePath"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blankCorrected: { type: "number" },
    pathNormalized: { type: "number" },
  },
  required: ["blankCorrected", "pathNormalized"],
} as const;
/** Signed blank subtraction followed by linear path-length normalization, without analyte calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, blank, pathLength, referencePath } = request;
  const compute = (): Output => {
    H.positive(pathLength);
    H.positive(referencePath);
    return {
      blankCorrected: observed - blank,
      pathNormalized: ((observed - blank) * referencePath) / pathLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 0.8, blank: 0.1, pathLength: 2, referencePath: 1 },
  output: {
    blankCorrected: 0.7000000000000001,
    pathNormalized: 0.35000000000000003,
  },
} satisfies ToolExample<Input, Output>;
export const opticalPathCorrectionSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/optical-path-correction-sign",
    title: "Optical Path Correction Sign Tool",
    description:
      "Signed blank subtraction followed by linear path-length normalization, without analyte calibration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "number" },
        blank: { type: "number" },
        pathLength: { type: "number", exclusiveMinimum: 0 },
        referencePath: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observed", "blank", "pathLength", "referencePath"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blankCorrected: { type: "number" },
        pathNormalized: { type: "number" },
      },
      required: ["blankCorrected", "pathNormalized"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blank",
          label: "Blank",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pathLength",
          label: "Path Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePath",
          label: "Reference Path",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "blankCorrected",
          label: "Blank Corrected",
          valueType: { type: "number" },
        },
        {
          id: "pathNormalized",
          label: "Path Normalized",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = opticalPathCorrectionSignTool.execute;
export default opticalPathCorrectionSignTool;
