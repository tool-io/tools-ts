import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly anchorIntroSeconds: number;
  readonly voiceOverSeconds: number;
  readonly soundbiteSeconds: number;
  readonly reporterTrackSeconds: number;
  readonly tagSeconds: number;
  readonly runtimeLimitSeconds: number;
}>;
export type Output = Readonly<{
  readonly totalRuntimeSeconds: number;
  readonly runtimeMarginSeconds: number;
  readonly withinLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  const totalRuntimeSeconds =
    input.anchorIntroSeconds +
    input.voiceOverSeconds +
    input.soundbiteSeconds +
    input.reporterTrackSeconds +
    input.tagSeconds;
  return {
    totalRuntimeSeconds,
    runtimeMarginSeconds: input.runtimeLimitSeconds - totalRuntimeSeconds,
    withinLimit: totalRuntimeSeconds <= input.runtimeLimitSeconds,
  };
};

export const exampleInput = {
  anchorIntroSeconds: 10,
  voiceOverSeconds: 20,
  soundbiteSeconds: 15,
  reporterTrackSeconds: 40,
  tagSeconds: 5,
  runtimeLimitSeconds: 90,
} satisfies Input;
export const exampleOutput = {
  totalRuntimeSeconds: 90,
  runtimeMarginSeconds: 0,
  withinLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      anchorIntroSeconds: input.anchorIntroSeconds as number,
      voiceOverSeconds: input.voiceOverSeconds as number,
      soundbiteSeconds: input.soundbiteSeconds as number,
      reporterTrackSeconds: input.reporterTrackSeconds as number,
      tagSeconds: input.tagSeconds as number,
      runtimeLimitSeconds: input.runtimeLimitSeconds as number,
    }),
  description: "Total broadcast package elements against a runtime limit.",
  id: "journalism/package-runtime",
  inputs: [
    {
      id: "anchorIntroSeconds",
      label: "Anchor introduction",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "voiceOverSeconds",
      label: "Voice-over",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "soundbiteSeconds",
      label: "Soundbite",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "reporterTrackSeconds",
      label: "Reporter track",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    { id: "tagSeconds", label: "Tag", kind: "number", minimum: 0, unit: "s" },
    {
      id: "runtimeLimitSeconds",
      label: "Runtime limit",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      id: "totalRuntimeSeconds",
      label: "Package runtime",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "runtimeMarginSeconds",
      label: "Runtime margin",
      kind: "number",
      unit: "s",
    },
    { id: "withinLimit", label: "Within supplied limit", kind: "boolean" },
  ],
  title: "Package Runtime",
});

export const run = tool.execute;
export default tool;
