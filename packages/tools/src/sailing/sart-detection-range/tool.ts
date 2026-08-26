import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SartDetectionRangeInput = {
  readonly responderAntennaFeet: number;
  readonly sartHeightFeet: number;
};

export type SartDetectionRangeOutput = {
  readonly detectionRangeNm: number;
};

const RADAR_HORIZON_COEFFICIENT = 1.17;
const MAX_DETECTION_RANGE_NM = 40;

export const calculateSartDetectionRange = (
  input: SartDetectionRangeInput,
): SartDetectionRangeOutput | null =>
  Number.isFinite(input.sartHeightFeet) &&
  Number.isFinite(input.responderAntennaFeet) &&
  input.sartHeightFeet > 0 &&
  input.responderAntennaFeet > 0
    ? {
        detectionRangeNm: Math.min(
          MAX_DETECTION_RANGE_NM,
          RADAR_HORIZON_COEFFICIENT *
            (Math.sqrt(input.sartHeightFeet) +
              Math.sqrt(input.responderAntennaFeet)),
        ),
      }
    : null;

export const sartDetectionRangeExample = {
  input: { responderAntennaFeet: 25, sartHeightFeet: 25 },
  output: { detectionRangeNm: 11.7 },
} satisfies ToolExample<SartDetectionRangeInput, SartDetectionRangeOutput>;

export const sartDetectionRangeTool = createSimpleTool({
  id: "sailing/sart-detection-range",
  title: "SART Detection Range",
  description:
    "Estimate the radar detection range of a search and rescue radar transponder as one point one seven times the sum of the square roots of the SART mounting height and the responding antenna height in feet, capped at forty nautical miles.",
  inputs: [
    {
      description: "Mounting height of the SART above the water in feet.",
      id: "sartHeightFeet",
      kind: "number",
      label: "SART height",
      unit: "ft",
    },
    {
      description:
        "Antenna height of the responding vessel above the water in feet.",
      id: "responderAntennaFeet",
      kind: "number",
      label: "Responder antenna height",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description: "Expected radar detection range of the SART.",
      format: "length-nm",
      id: "detectionRangeNm",
      kind: "number",
      label: "Detection range",
      unit: "NM",
    },
  ],
  calculate: (input) => {
    const detectionRangeNm = calculateSartDetectionRange(
      input as unknown as SartDetectionRangeInput,
    );
    if (detectionRangeNm === null)
      simpleError(
        "sartHeightFeet",
        "Both heights must be finite and greater than zero feet.",
        "invalid_height",
      );
    return detectionRangeNm;
  },
});

export const runSartDetectionRange = sartDetectionRangeTool.execute;
export default sartDetectionRangeTool;
