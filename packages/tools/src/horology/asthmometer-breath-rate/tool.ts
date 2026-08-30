import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AsthmometerBreathRateInput = Readonly<{
  readonly breathCount: number;
  readonly elapsedSeconds: number;
}>;
export type AsthmometerBreathRateOutput = Readonly<{
  readonly breathsPerMinute: number;
}>;

export const calculateAsthmometerBreathRate = (
  x: AsthmometerBreathRateInput,
): AsthmometerBreathRateOutput => {
  if (
    !Number.isFinite(x.breathCount) ||
    !Number.isSafeInteger(x.breathCount) ||
    x.breathCount < 1
  )
    simpleError("breathCount", "Provide a positive safe integer.");
  if (!Number.isFinite(x.elapsedSeconds) || x.elapsedSeconds <= 0)
    simpleError("elapsedSeconds", "Provide a finite positive number.");
  const breathsPerMinute = (60 * x.breathCount) / x.elapsedSeconds;
  if (!Number.isFinite(breathsPerMinute))
    simpleError(
      "breathsPerMinute",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    breathsPerMinute: Object.is(breathsPerMinute, -0) ? 0 : breathsPerMinute,
  };
};

export const example = {
  input: {
    breathCount: 10,
    elapsedSeconds: 30,
  },
  output: { breathsPerMinute: 20 },
} satisfies ToolExample<
  AsthmometerBreathRateInput,
  AsthmometerBreathRateOutput
>;

export const tool = createSimpleTool({
  id: "horology/asthmometer-breath-rate",
  title: "Asthmometer Breath Rate",
  description:
    "Breaths per minute from a counted number of breaths and elapsed seconds.",
  inputs: [
    { id: "breathCount", kind: "integer", label: "Breath Count", minimum: 1 },
    {
      id: "elapsedSeconds",
      kind: "number",
      label: "Elapsed Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "breathsPerMinute",
      kind: "number",
      label: "Breaths Per Minute",
      unit: "1/min",
    },
  ],
  calculate: (input) =>
    calculateAsthmometerBreathRate({
      breathCount: input.breathCount as number,
      elapsedSeconds: input.elapsedSeconds as number,
    }),
});
export const asthmometerBreathRateTool = tool;
export const runAsthmometerBreathRate = tool.execute;
export default tool;
