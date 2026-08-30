import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly introSeconds: number;
  readonly messageSeconds: number;
  readonly translationSeconds: number;
  readonly outroSeconds: number;
  readonly maximumRuntimeSeconds: number;
}>;
export type Output = Readonly<{
  readonly totalRuntimeSeconds: number;
  readonly remainingSeconds: number;
  readonly withinRuntime: boolean;
}>;

export const calculate = (input: Input): Output => {
  const totalRuntimeSeconds =
    input.introSeconds +
    input.messageSeconds +
    input.translationSeconds +
    input.outroSeconds;
  return {
    totalRuntimeSeconds,
    remainingSeconds: input.maximumRuntimeSeconds - totalRuntimeSeconds,
    withinRuntime: totalRuntimeSeconds <= input.maximumRuntimeSeconds,
  };
};

export const exampleInput = {
  introSeconds: 5,
  messageSeconds: 30,
  translationSeconds: 20,
  outroSeconds: 5,
  maximumRuntimeSeconds: 60,
} satisfies Input;
export const exampleOutput = {
  totalRuntimeSeconds: 60,
  remainingSeconds: 0,
  withinRuntime: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      introSeconds: input.introSeconds as number,
      messageSeconds: input.messageSeconds as number,
      translationSeconds: input.translationSeconds as number,
      outroSeconds: input.outroSeconds as number,
      maximumRuntimeSeconds: input.maximumRuntimeSeconds as number,
    }),
  description:
    "Budget an emergency-alert cut-in against a caller-supplied runtime.",
  id: "journalism/eas-cut-in-runtime",
  inputs: [
    {
      id: "introSeconds",
      label: "Cut-in introduction",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "messageSeconds",
      label: "Alert message",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "translationSeconds",
      label: "Translation or accessibility audio",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "outroSeconds",
      label: "Cut-in close",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "maximumRuntimeSeconds",
      label: "Maximum runtime",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      id: "totalRuntimeSeconds",
      label: "Total cut-in runtime",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "remainingSeconds",
      label: "Runtime margin",
      kind: "number",
      unit: "s",
    },
    { id: "withinRuntime", label: "Within supplied runtime", kind: "boolean" },
  ],
  title: "EAS Cut-In Runtime",
});

export const run = tool.execute;
export default tool;
