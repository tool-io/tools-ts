import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InterSymbolInterferencePenaltyInput = Readonly<{
  readonly idealEyeOpening: number;
  readonly measuredEyeOpening: number;
}>;
export type InterSymbolInterferencePenaltyOutput = Readonly<{
  readonly isiPenaltyDb: number;
}>;

export const calculateInterSymbolInterferencePenalty = (
  x: InterSymbolInterferencePenaltyInput,
): InterSymbolInterferencePenaltyOutput => {
  if (!Number.isFinite(x.idealEyeOpening) || x.idealEyeOpening < 0)
    simpleError("idealEyeOpening", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.measuredEyeOpening) || x.measuredEyeOpening < 0)
    simpleError("measuredEyeOpening", "Provide a finite number at least 0.");
  if (!(
    x.idealEyeOpening > 0 &&
    x.measuredEyeOpening > 0 &&
    x.idealEyeOpening >= x.measuredEyeOpening
  ))
    simpleError(
      "input",
      "Reference eye opening must be at least measured opening.",
    );
  const isiPenaltyDb =
    20 * Math.log10(x.idealEyeOpening / x.measuredEyeOpening);
  if (!Number.isFinite(isiPenaltyDb))
    simpleError("isiPenaltyDb", "The inputs produce an invalid result.");
  return { isiPenaltyDb: Object.is(isiPenaltyDb, -0) ? 0 : isiPenaltyDb };
};

export const example = {
  input: { idealEyeOpening: 2, measuredEyeOpening: 1 },
  output: { isiPenaltyDb: 6.020599913279624 },
} satisfies ToolExample<
  InterSymbolInterferencePenaltyInput,
  InterSymbolInterferencePenaltyOutput
>;

export const tool = createSimpleTool({
  id: "electronics/inter-symbol-interference-penalty",
  title: "Inter Symbol Interference Penalty",
  description:
    "Express horizontal or vertical eye-opening loss as an equivalent amplitude penalty in decibels using matching eye-opening measurements.",
  inputs: [
    {
      id: "idealEyeOpening",
      kind: "number",
      label: "Reference eye opening",
      minimum: 0,
    },
    {
      id: "measuredEyeOpening",
      kind: "number",
      label: "Measured eye opening",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "isiPenaltyDb",
      kind: "number",
      label: "Eye-opening penalty",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateInterSymbolInterferencePenalty({
      idealEyeOpening: input.idealEyeOpening as number,
      measuredEyeOpening: input.measuredEyeOpening as number,
    }),
});
export const interSymbolInterferencePenaltyTool = tool;
export const runInterSymbolInterferencePenalty = tool.execute;
export default tool;
