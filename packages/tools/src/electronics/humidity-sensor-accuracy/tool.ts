import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HumiditySensorAccuracyInput = Readonly<{
  readonly readingPercentRh: number;
  readonly accuracyPointsRh: number;
}>;
export type HumiditySensorAccuracyOutput = Readonly<{
  readonly lowerPercentRh: number;
  readonly upperPercentRh: number;
}>;

export const calculateHumiditySensorAccuracy = (
  x: HumiditySensorAccuracyInput,
): HumiditySensorAccuracyOutput => {
  if (!Number.isFinite(x.readingPercentRh) || x.readingPercentRh < 0)
    simpleError("readingPercentRh", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.accuracyPointsRh) || x.accuracyPointsRh < 0)
    simpleError("accuracyPointsRh", "Provide a finite number at least 0.");
  if (!(x.readingPercentRh <= 100 && x.accuracyPointsRh <= 100))
    simpleError(
      "input",
      "RH reading and accuracy must not exceed 100 percentage points.",
    );
  const lowerPercentRh = Math.max(0, x.readingPercentRh - x.accuracyPointsRh);
  if (!Number.isFinite(lowerPercentRh))
    simpleError("lowerPercentRh", "The inputs produce an invalid result.");
  const upperPercentRh = Math.min(100, x.readingPercentRh + x.accuracyPointsRh);
  if (!Number.isFinite(upperPercentRh))
    simpleError("upperPercentRh", "The inputs produce an invalid result.");
  return {
    lowerPercentRh: Object.is(lowerPercentRh, -0) ? 0 : lowerPercentRh,
    upperPercentRh: Object.is(upperPercentRh, -0) ? 0 : upperPercentRh,
  };
};

export const example = {
  input: { readingPercentRh: 50, accuracyPointsRh: 2 },
  output: { lowerPercentRh: 48, upperPercentRh: 52 },
} satisfies ToolExample<
  HumiditySensorAccuracyInput,
  HumiditySensorAccuracyOutput
>;

export const tool = createSimpleTool({
  id: "electronics/humidity-sensor-accuracy",
  title: "Humidity Sensor Accuracy",
  description:
    "Apply a sensor's specified absolute percent-RH accuracy to a measured relative humidity reading; this is not a confidence interval.",
  inputs: [
    {
      id: "readingPercentRh",
      kind: "number",
      label: "Measured relative humidity",
      unit: "%RH",
      minimum: 0,
    },
    {
      id: "accuracyPointsRh",
      kind: "number",
      label: "Absolute accuracy",
      unit: "percentage points RH",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "lowerPercentRh",
      kind: "number",
      label: "Lower rated bound",
      unit: "%RH",
    },
    {
      id: "upperPercentRh",
      kind: "number",
      label: "Upper rated bound",
      unit: "%RH",
    },
  ],
  calculate: (input) =>
    calculateHumiditySensorAccuracy({
      readingPercentRh: input.readingPercentRh as number,
      accuracyPointsRh: input.accuracyPointsRh as number,
    }),
});
export const humiditySensorAccuracyTool = tool;
export const runHumiditySensorAccuracy = tool.execute;
export default tool;
