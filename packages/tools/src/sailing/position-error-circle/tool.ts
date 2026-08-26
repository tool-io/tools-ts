import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PositionErrorCircleInput = {
  readonly compassErrorDegrees?: number;
  readonly distanceRunNm: number;
};

export type PositionErrorCircleOutput = {
  readonly errorCircleRadiusNm: number;
};

const DEFAULT_COMPASS_ERROR_DEGREES = 2;
const MAX_COMPASS_ERROR_DEGREES = 10;
const RADIANS_APPROXIMATION_DEG = 57.3;

export const calculatePositionErrorCircle = (
  input: PositionErrorCircleInput,
): PositionErrorCircleOutput | null => {
  const compassErrorDegrees =
    input.compassErrorDegrees ?? DEFAULT_COMPASS_ERROR_DEGREES;
  return Number.isFinite(input.distanceRunNm) &&
    Number.isFinite(compassErrorDegrees) &&
    input.distanceRunNm > 0 &&
    compassErrorDegrees >= 0 &&
    compassErrorDegrees <= MAX_COMPASS_ERROR_DEGREES
    ? {
        errorCircleRadiusNm:
          (input.distanceRunNm * compassErrorDegrees) /
          RADIANS_APPROXIMATION_DEG,
      }
    : null;
};

export const positionErrorCircleExample = {
  input: { compassErrorDegrees: 2, distanceRunNm: 57.3 },
  output: { errorCircleRadiusNm: 2 },
} satisfies ToolExample<PositionErrorCircleInput, PositionErrorCircleOutput>;

export const positionErrorCircleTool = createSimpleTool({
  id: "sailing/position-error-circle",
  title: "Position Error Circle",
  description:
    "Estimate the radius of the position error circle from a compass steering error as distance run times the error in degrees divided by fifty seven point three.",
  inputs: [
    {
      description: "Distance sailed since the last fix.",
      id: "distanceRunNm",
      kind: "number",
      label: "Distance run",
      unit: "NM",
    },
    {
      default: DEFAULT_COMPASS_ERROR_DEGREES,
      description: "Assumed steering or deviation error of the compass.",
      id: "compassErrorDegrees",
      kind: "number",
      label: "Compass error",
      maximum: MAX_COMPASS_ERROR_DEGREES,
      minimum: 0,
      unit: "\u00B0",
    },
  ],
  outputs: [
    {
      description: "Radius of the circle containing the probable position.",
      format: "length-nm",
      id: "errorCircleRadiusNm",
      kind: "number",
      label: "Error circle radius",
      unit: "NM",
    },
  ],
  calculate: (input) => {
    const errorCircleRadiusNm = calculatePositionErrorCircle(
      input as unknown as PositionErrorCircleInput,
    );
    if (errorCircleRadiusNm === null)
      simpleError(
        "distanceRunNm",
        "The distance run must be finite and greater than zero.",
        "invalid_distance",
      );
    return errorCircleRadiusNm;
  },
});

export const runPositionErrorCircle = positionErrorCircleTool.execute;
export default positionErrorCircleTool;
