import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LocalizationItdMaxDelayInput = Readonly<{
  readonly earSeparationMeters: number;
  readonly speedMetersPerSecond: number;
}>;
export type LocalizationItdMaxDelayOutput = Readonly<{
  readonly microseconds: number;
}>;

export const calculateLocalizationItdMaxDelay = (
  x: LocalizationItdMaxDelayInput,
): LocalizationItdMaxDelayOutput => {
  if (!Number.isFinite(x.earSeparationMeters) || x.earSeparationMeters <= 0)
    simpleError("earSeparationMeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond <= 0)
    simpleError("speedMetersPerSecond", "Provide a finite positive number.");
  const microseconds = (1e6 * x.earSeparationMeters) / x.speedMetersPerSecond;
  if (!Number.isFinite(microseconds))
    simpleError(
      "microseconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { microseconds: Object.is(microseconds, -0) ? 0 : microseconds };
};

export const example = {
  input: {
    earSeparationMeters: 0.18,
    speedMetersPerSecond: 343,
  },
  output: { microseconds: 524.7813411078718 },
} satisfies ToolExample<
  LocalizationItdMaxDelayInput,
  LocalizationItdMaxDelayOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/localization-itd-max-delay",
  title: "Localization Itd Max Delay",
  description:
    "Simple maximum interaural time difference in microseconds using a straight ear-to-ear baseline and sound speed.",
  inputs: [
    {
      id: "earSeparationMeters",
      kind: "number",
      label: "Ear Separation Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "microseconds", kind: "number", label: "Microseconds", unit: "us" },
  ],
  calculate: (input) =>
    calculateLocalizationItdMaxDelay({
      earSeparationMeters: input.earSeparationMeters as number,
      speedMetersPerSecond: input.speedMetersPerSecond as number,
    }),
});
export const localizationItdMaxDelayTool = tool;
export const runLocalizationItdMaxDelay = tool.execute;
export default tool;
