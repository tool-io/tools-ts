import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GroundspeedRequiredForEtaInput = {
  readonly distanceNm: number;
  readonly minutesUntilDeadline: number;
};

export type GroundspeedRequiredForEtaOutput = {
  readonly requiredGroundSpeedKt: number;
};

export const groundspeedRequiredForEtaExample = {
  input: { distanceNm: 180, minutesUntilDeadline: 45 },
  output: { requiredGroundSpeedKt: 240 },
} satisfies ToolExample<
  GroundspeedRequiredForEtaInput,
  GroundspeedRequiredForEtaOutput
>;

export const calculateGroundspeedRequiredForEta = (
  input: GroundspeedRequiredForEtaInput,
): GroundspeedRequiredForEtaOutput => {
  if (input.distanceNm <= 0)
    simpleError(
      "distanceNm",
      "The distance must be greater than zero.",
      "invalid_distance",
    );
  if (input.minutesUntilDeadline <= 0)
    simpleError(
      "minutesUntilDeadline",
      "The time remaining must be greater than zero.",
      "invalid_time_remaining",
    );
  return {
    requiredGroundSpeedKt: input.distanceNm / (input.minutesUntilDeadline / 60),
  };
};

export const groundspeedRequiredForEtaTool = createSimpleTool({
  calculate: (input) =>
    calculateGroundspeedRequiredForEta(
      input as unknown as GroundspeedRequiredForEtaInput,
    ),
  description:
    "Compute the constant ground speed needed to cover a distance before a deadline.",
  id: "aviation/groundspeed-required-for-eta",
  inputs: [
    {
      description: "Distance still to fly.",
      id: "distanceNm",
      kind: "number",
      label: "Distance",
      minimum: 0,
      unit: "nm",
    },
    {
      description: "Time remaining until the arrival deadline.",
      id: "minutesUntilDeadline",
      kind: "number",
      label: "Time to deadline",
      minimum: 0,
      unit: "min",
    },
  ],
  outputs: [
    {
      description: "Constant ground speed that exactly meets the deadline.",
      format: "speed",
      id: "requiredGroundSpeedKt",
      kind: "number",
      label: "Required ground speed",
      unit: "kt",
    },
  ],
  title: "Groundspeed Required for ETA Calculator",
});
export const runGroundspeedRequiredForEta =
  groundspeedRequiredForEtaTool.execute;
export default groundspeedRequiredForEtaTool;
