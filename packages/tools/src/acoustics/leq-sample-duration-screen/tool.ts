import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly actualDurationSeconds: number;
  readonly requiredMinimumDurationSeconds: number;
}>;
export type Output = Readonly<{
  readonly durationMarginSeconds: number;
  readonly meetsProtocolMinimum: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    !Number.isFinite(input.actualDurationSeconds) ||
    input.actualDurationSeconds <= 0 ||
    !Number.isFinite(input.requiredMinimumDurationSeconds) ||
    input.requiredMinimumDurationSeconds <= 0
  )
    simpleError(
      "actualDurationSeconds",
      "Durations must be finite and positive.",
      "invalid_duration",
    );
  const durationMarginSeconds =
    input.actualDurationSeconds - input.requiredMinimumDurationSeconds;
  return {
    durationMarginSeconds,
    meetsProtocolMinimum: durationMarginSeconds >= 0,
  };
};

export const example = {
  input: { actualDurationSeconds: 900, requiredMinimumDurationSeconds: 600 },
  output: { durationMarginSeconds: 300, meetsProtocolMinimum: true },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: { actualDurationSeconds: 300, requiredMinimumDurationSeconds: 600 },
  output: { durationMarginSeconds: -300, meetsProtocolMinimum: false },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      actualDurationSeconds: input.actualDurationSeconds as number,
      requiredMinimumDurationSeconds:
        input.requiredMinimumDurationSeconds as number,
    }),
  description:
    "Compare an actual equivalent-level sample duration with an explicit protocol minimum; no universal minimum duration is assumed.",
  id: "acoustics/leq-sample-duration-screen",
  inputs: [
    {
      id: "actualDurationSeconds",
      kind: "number",
      label: "Actual sample duration",
      minimum: 0,
      unit: "s",
    },
    {
      id: "requiredMinimumDurationSeconds",
      kind: "number",
      label: "Protocol minimum duration",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      id: "durationMarginSeconds",
      kind: "number",
      label: "Duration margin",
      unit: "s",
    },
    {
      id: "meetsProtocolMinimum",
      kind: "boolean",
      label: "Meets protocol minimum",
    },
  ],
  title: "Leq Sample-Duration Screen",
});

export const run = tool.execute;
export default tool;
