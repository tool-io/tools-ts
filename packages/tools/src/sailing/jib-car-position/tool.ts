import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JibCarPositionInput = {
  readonly jibFootLengthMeters: number;
  readonly leadPercentage?: number;
};

export type JibCarPositionOutput = {
  readonly carPositionCm: number;
};

const DEFAULT_LEAD_PERCENTAGE = 30;

export const jibCarPositionExample = {
  input: { jibFootLengthMeters: 4 },
  output: { carPositionCm: 120 },
} satisfies ToolExample<JibCarPositionInput, JibCarPositionOutput>;

export const calculateJibCarPosition = (
  input: JibCarPositionInput,
): JibCarPositionOutput => {
  if (input.jibFootLengthMeters <= 0)
    simpleError(
      "jibFootLengthMeters",
      "The jib foot length must be positive.",
      "invalid_input",
    );
  const leadPercentage = input.leadPercentage ?? DEFAULT_LEAD_PERCENTAGE;
  return {
    carPositionCm: Number(
      (input.jibFootLengthMeters * leadPercentage).toPrecision(12),
    ),
  };
};

export const jibCarPositionTool = createSimpleTool({
  calculate: (input) =>
    calculateJibCarPosition(input as unknown as JibCarPositionInput),
  description:
    "Compute a jib-car reference position as a selected percentage of foot length, measured aft of the clew. Final trim still depends on clew height and sheeting geometry.",
  id: "sailing/jib-car-position",
  inputs: [
    {
      description: "Foot length of the jib from tack to clew.",
      format: "length-m",
      id: "jibFootLengthMeters",
      kind: "number",
      label: "Jib foot length",
      unit: "m",
    },
    {
      default: DEFAULT_LEAD_PERCENTAGE,
      description:
        "Distance of the lead aft of the clew as a percentage of the foot length.",
      id: "leadPercentage",
      kind: "number",
      label: "Lead percentage",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Car position aft of the clew in centimeters.",
      format: "length-cm",
      id: "carPositionCm",
      kind: "number",
      label: "Car position",
      unit: "cm",
    },
  ],
  title: "Jib Car Position Calculator",
});
export const runJibCarPosition = jibCarPositionTool.execute;
export default jibCarPositionTool;
