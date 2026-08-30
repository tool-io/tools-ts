import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly dayLevelDecibels: number;
  readonly eveningLevelDecibels: number;
  readonly nightLevelDecibels: number;
}>;
export type Output = Readonly<{ readonly ldenDecibels: number }>;

export const calculate = (input: Input): Output => {
  for (const [field, value] of Object.entries(input))
    if (!Number.isFinite(value))
      simpleError(field, "Segment levels must be finite.", "invalid_level");
  const directEnergy =
    (12 * 10 ** (input.dayLevelDecibels / 10) +
      4 * 10 ** ((input.eveningLevelDecibels + 5) / 10) +
      8 * 10 ** ((input.nightLevelDecibels + 10) / 10)) /
    24;
  const maximumAdjustedLevel = Math.max(
    input.dayLevelDecibels,
    input.eveningLevelDecibels + 5,
    input.nightLevelDecibels + 10,
  );
  const ldenDecibels =
    directEnergy > 0 && Number.isFinite(directEnergy)
      ? 10 * Math.log10(directEnergy)
      : maximumAdjustedLevel +
        10 *
          Math.log10(
            (12 * 10 ** ((input.dayLevelDecibels - maximumAdjustedLevel) / 10) +
              4 *
                10 **
                  ((input.eveningLevelDecibels + 5 - maximumAdjustedLevel) /
                    10) +
              8 *
                10 **
                  ((input.nightLevelDecibels + 10 - maximumAdjustedLevel) /
                    10)) /
              24,
          );
  if (!Number.isFinite(ldenDecibels))
    simpleError("ldenDecibels", "Result is out of range.", "numeric_overflow");
  return { ldenDecibels };
};

export const example = {
  input: {
    dayLevelDecibels: 60,
    eveningLevelDecibels: 55,
    nightLevelDecibels: 50,
  },
  output: { ldenDecibels: 60 },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    dayLevelDecibels: 0,
    eveningLevelDecibels: 0,
    nightLevelDecibels: 0,
  },
  output: { ldenDecibels: 6.395243001318603 },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      dayLevelDecibels: input.dayLevelDecibels as number,
      eveningLevelDecibels: input.eveningLevelDecibels as number,
      nightLevelDecibels: input.nightLevelDecibels as number,
    }),
  description:
    "Calculate Lden from 12-hour day, 4-hour evening, and 8-hour night Leq values with 5 dB and 10 dB penalties.",
  id: "acoustics/day-evening-night-level",
  inputs: [
    { id: "dayLevelDecibels", kind: "number", label: "Day Leq", unit: "dB" },
    {
      id: "eveningLevelDecibels",
      kind: "number",
      label: "Evening Leq",
      unit: "dB",
    },
    {
      id: "nightLevelDecibels",
      kind: "number",
      label: "Night Leq",
      unit: "dB",
    },
  ],
  outputs: [{ id: "ldenDecibels", kind: "number", label: "Lden", unit: "dB" }],
  title: "Day-Evening-Night Level",
});

export const run = tool.execute;
export default tool;
