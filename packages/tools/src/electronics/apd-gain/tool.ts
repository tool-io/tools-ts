import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ApdGainInput = Readonly<{
  readonly multipliedPhotocurrentA: number;
  readonly primaryPhotocurrentA: number;
}>;
export type ApdGainOutput = Readonly<{
  readonly multiplicationFactor: number;
}>;

export const calculateApdGain = (x: ApdGainInput): ApdGainOutput => {
  if (
    !Number.isFinite(x.multipliedPhotocurrentA) ||
    x.multipliedPhotocurrentA < 0
  )
    simpleError(
      "multipliedPhotocurrentA",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.primaryPhotocurrentA) || x.primaryPhotocurrentA < 0)
    simpleError("primaryPhotocurrentA", "Provide a finite number at least 0.");
  if (!(
    x.primaryPhotocurrentA > 0 &&
    x.multipliedPhotocurrentA >= x.primaryPhotocurrentA
  ))
    simpleError(
      "input",
      "Primary current must be positive and multiplication at least one.",
    );
  const multiplicationFactor =
    x.multipliedPhotocurrentA / x.primaryPhotocurrentA;
  if (!Number.isFinite(multiplicationFactor))
    simpleError(
      "multiplicationFactor",
      "The inputs produce an invalid result.",
    );
  return {
    multiplicationFactor: Object.is(multiplicationFactor, -0)
      ? 0
      : multiplicationFactor,
  };
};

export const example = {
  input: { multipliedPhotocurrentA: 0.0002, primaryPhotocurrentA: 0.0001 },
  output: { multiplicationFactor: 2 },
} satisfies ToolExample<ApdGainInput, ApdGainOutput>;

export const tool = createSimpleTool({
  id: "electronics/apd-gain",
  title: "APD Gain",
  description:
    "Calculate avalanche photodiode current multiplication from multiplied photocurrent and unity-gain primary photocurrent after dark-current subtraction.",
  inputs: [
    {
      id: "multipliedPhotocurrentA",
      kind: "number",
      label: "Multiplied photocurrent",
      unit: "A",
      minimum: 0,
    },
    {
      id: "primaryPhotocurrentA",
      kind: "number",
      label: "Unity-gain photocurrent",
      unit: "A",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "multiplicationFactor", kind: "number", label: "APD multiplication" },
  ],
  calculate: (input) =>
    calculateApdGain({
      multipliedPhotocurrentA: input.multipliedPhotocurrentA as number,
      primaryPhotocurrentA: input.primaryPhotocurrentA as number,
    }),
});
export const apdGainTool = tool;
export const runApdGain = tool.execute;
export default tool;
