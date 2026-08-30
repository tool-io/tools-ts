import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly relaxationDelaySeconds: number;
  readonly longestT1Seconds: number;
  readonly requiredT1Multiples: number;
}>;
export type Output = Readonly<{
  readonly requiredDelaySeconds: number;
  readonly delayMarginSeconds: number;
  readonly compliant: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.relaxationDelaySeconds < 0 ||
    input.longestT1Seconds <= 0 ||
    input.requiredT1Multiples <= 0
  )
    simpleError(
      "longestT1Seconds",
      "Positive relaxation time and rule multiple required.",
    );
  const requiredDelaySeconds =
      input.longestT1Seconds * input.requiredT1Multiples,
    delayMarginSeconds = input.relaxationDelaySeconds - requiredDelaySeconds;
  return {
    requiredDelaySeconds,
    delayMarginSeconds,
    compliant: delayMarginSeconds >= 0,
  };
};
export const exampleInput = {
  relaxationDelaySeconds: 10,
  longestT1Seconds: 2,
  requiredT1Multiples: 5,
} satisfies Input;
export const exampleOutput = {
  requiredDelaySeconds: 10,
  delayMarginSeconds: 0,
  compliant: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/nmr-relaxation-delay",
  title: "NMR Relaxation Delay",
  description: "Check NMR relaxation delay against an injected T1 multiple.",
  inputs: [
    {
      id: "relaxationDelaySeconds",
      kind: "number",
      label: "Relaxation delay seconds",
    },
    { id: "longestT1Seconds", kind: "number", label: "Longest t 1 seconds" },
    {
      id: "requiredT1Multiples",
      kind: "number",
      label: "Required t 1 multiples",
    },
  ],
  outputs: [
    {
      id: "requiredDelaySeconds",
      kind: "number",
      label: "Required delay seconds",
    },
    { id: "delayMarginSeconds", kind: "number", label: "Delay margin seconds" },
    { id: "compliant", kind: "boolean", label: "Compliant" },
  ],
  calculate: (value) =>
    calculate({
      relaxationDelaySeconds: value.relaxationDelaySeconds as number,
      longestT1Seconds: value.longestT1Seconds as number,
      requiredT1Multiples: value.requiredT1Multiples as number,
    }),
});
export const run = tool.execute;
export default tool;
