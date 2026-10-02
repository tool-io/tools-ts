import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly markerAmounts: readonly number[];
  readonly calibrationPresent: readonly boolean[];
  readonly referenceCurrent: readonly boolean[];
  readonly matrixMatched: readonly boolean[];
};
export type Output = {
  readonly totalMarkerAmount: number;
  readonly supportedMarkerAmount: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markerAmounts: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    calibrationPresent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    referenceCurrent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    matrixMatched: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: [
    "markerAmounts",
    "calibrationPresent",
    "referenceCurrent",
    "matrixMatched",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMarkerAmount: { type: "number" },
    supportedMarkerAmount: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["totalMarkerAmount", "supportedMarkerAmount", "share", "defined"],
} as const;
/** Calculate marker calibration support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { markerAmounts, calibrationPresent, referenceCurrent, matrixMatched } =
    request;
  const compute = (): Output => {
    H.sameLength(markerAmounts, calibrationPresent);
    H.sameLength(markerAmounts, referenceCurrent);
    H.sameLength(markerAmounts, matrixMatched);
    H.domain(markerAmounts.every((x) => x >= 0));
    return (() => {
      const totalMarkerAmount = markerAmounts.reduce((a, b) => a + b, 0),
        supportedMarkerAmount = markerAmounts.reduce(
          (s, x, i) =>
            s +
            (calibrationPresent[i] && referenceCurrent[i] && matrixMatched[i]
              ? x
              : 0),
          0,
        );
      return {
        totalMarkerAmount,
        supportedMarkerAmount,
        share:
          totalMarkerAmount > 0 ? supportedMarkerAmount / totalMarkerAmount : 0,
        defined: totalMarkerAmount > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    markerAmounts: [2, 3, 5],
    calibrationPresent: [true, true, true],
    referenceCurrent: [true, true, false],
    matrixMatched: [true, false, true],
  },
  output: {
    totalMarkerAmount: 10,
    supportedMarkerAmount: 2,
    share: 0.2,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const markerCalibrationSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacognosy/marker-calibration-support-share",
    title: "Marker Calibration Support Share Tool",
    description:
      "Calculate marker calibration support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        markerAmounts: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        calibrationPresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        referenceCurrent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        matrixMatched: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "markerAmounts",
        "calibrationPresent",
        "referenceCurrent",
        "matrixMatched",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalMarkerAmount: { type: "number" },
        supportedMarkerAmount: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "totalMarkerAmount",
        "supportedMarkerAmount",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "markerAmounts",
          label: "Marker Amounts",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "calibrationPresent",
          label: "Calibration Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "referenceCurrent",
          label: "Reference Current",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "matrixMatched",
          label: "Matrix Matched",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "totalMarkerAmount",
          label: "Total Marker Amount",
          valueType: { type: "number" },
        },
        {
          id: "supportedMarkerAmount",
          label: "Supported Marker Amount",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = markerCalibrationSupportShareTool.execute;
export default markerCalibrationSupportShareTool;
