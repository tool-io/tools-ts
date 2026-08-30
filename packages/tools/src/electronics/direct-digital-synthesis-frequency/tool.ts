import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DirectDigitalSynthesisFrequencyInput = Readonly<{
  readonly clockHertz: number;
  readonly tuningWord: number;
  readonly accumulatorBits: number;
}>;
export type DirectDigitalSynthesisFrequencyOutput = Readonly<{
  readonly outputHertz: number;
}>;

export const calculateDirectDigitalSynthesisFrequency = (
  x: DirectDigitalSynthesisFrequencyInput,
): DirectDigitalSynthesisFrequencyOutput => {
  if (!Number.isFinite(x.clockHertz) || x.clockHertz < 0)
    simpleError("clockHertz", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.tuningWord) ||
    !Number.isSafeInteger(x.tuningWord) ||
    x.tuningWord < 0
  )
    simpleError("tuningWord", "Provide a safe integer at least 0.");
  if (
    !Number.isFinite(x.accumulatorBits) ||
    !Number.isSafeInteger(x.accumulatorBits) ||
    x.accumulatorBits < 0
  )
    simpleError("accumulatorBits", "Provide a safe integer at least 0.");
  if (
    !Number.isSafeInteger(x.tuningWord) ||
    !Number.isSafeInteger(x.accumulatorBits) ||
    x.accumulatorBits < 1 ||
    x.accumulatorBits > 52 ||
    x.tuningWord >= 2 ** x.accumulatorBits
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const outputHertz = (x.clockHertz * x.tuningWord) / 2 ** x.accumulatorBits;
  if (!Number.isFinite(outputHertz))
    simpleError(
      "outputHertz",
      "Inputs produce an undefined or non-finite result.",
    );
  return { outputHertz: Object.is(outputHertz, -0) ? 0 : outputHertz };
};

export const example = {
  input: { clockHertz: 100000000, tuningWord: 1073741824, accumulatorBits: 32 },
  output: { outputHertz: 25000000 },
} satisfies ToolExample<
  DirectDigitalSynthesisFrequencyInput,
  DirectDigitalSynthesisFrequencyOutput
>;

export const tool = createSimpleTool({
  id: "electronics/direct-digital-synthesis-frequency",
  title: "Direct Digital Synthesis Frequency",
  description:
    "DDS output frequency from an integer tuning word, system clock and phase accumulator bit width.",
  inputs: [
    {
      id: "clockHertz",
      kind: "number",
      label: "Clock Hertz",
      unit: "Hz",
      minimum: 0,
    },
    { id: "tuningWord", kind: "integer", label: "Tuning Word", minimum: 0 },
    {
      id: "accumulatorBits",
      kind: "integer",
      label: "Accumulator Bits",
      unit: "bits",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "outputHertz", kind: "number", label: "Output Hertz", unit: "Hz" },
  ],
  calculate: (input) =>
    calculateDirectDigitalSynthesisFrequency({
      clockHertz: input.clockHertz as number,
      tuningWord: input.tuningWord as number,
      accumulatorBits: input.accumulatorBits as number,
    }),
});
export const directDigitalSynthesisFrequencyTool = tool;
export const runDirectDigitalSynthesisFrequency = tool.execute;
export default tool;
