import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LighthouseGeographicRangeInput = {
  readonly objectHeightFeet: number;
  readonly observerHeightFeet: number;
};

export type LighthouseGeographicRangeOutput = {
  readonly geographicRangeNm: number;
};

const HORIZON_COEFFICIENT_NM_PER_SQRT_FT = 1.17;

export const lighthouseGeographicRangeExample = {
  input: { objectHeightFeet: 25, observerHeightFeet: 9 },
  output: { geographicRangeNm: 9.36 },
} satisfies ToolExample<
  LighthouseGeographicRangeInput,
  LighthouseGeographicRangeOutput
>;

export const calculateLighthouseGeographicRange = (
  input: LighthouseGeographicRangeInput,
): LighthouseGeographicRangeOutput => {
  if (input.observerHeightFeet < 0)
    simpleError(
      "observerHeightFeet",
      "Observer height cannot be negative.",
      "invalid_input",
    );
  if (input.objectHeightFeet < 0)
    simpleError(
      "objectHeightFeet",
      "Object height cannot be negative.",
      "invalid_input",
    );
  return {
    geographicRangeNm:
      HORIZON_COEFFICIENT_NM_PER_SQRT_FT *
      (Math.sqrt(input.observerHeightFeet) + Math.sqrt(input.objectHeightFeet)),
  };
};

export const lighthouseGeographicRangeTool = createSimpleTool({
  calculate: (input) =>
    calculateLighthouseGeographicRange(
      input as unknown as LighthouseGeographicRangeInput,
    ),
  description:
    "Compute the geographic range at which a light becomes visible as one point one seven times the sum of the square roots of observer and object heights in feet.",
  id: "sailing/lighthouse-geographic-range",
  inputs: [
    {
      description: "Elevation of the light above sea level.",
      format: "length-ft",
      id: "objectHeightFeet",
      kind: "number",
      label: "Object height",
      minimum: 0,
      unit: "ft",
    },
    {
      description:
        "Height of the observer's eye above the sea surface; combined heights use the one point one seven horizon coefficient.",
      format: "length-ft",
      id: "observerHeightFeet",
      kind: "number",
      label: "Observer height",
      minimum: 0,
      unit: "ft",
    },
  ],
  outputs: [
    {
      description:
        "Greatest distance in nautical miles at which the object is visible.",
      format: "length-nm",
      id: "geographicRangeNm",
      kind: "number",
      label: "Geographic range",
      unit: "NM",
    },
  ],
  title: "Lighthouse Geographic Range Calculator",
});
export const runLighthouseGeographicRange =
  lighthouseGeographicRangeTool.execute;
export default lighthouseGeographicRangeTool;
