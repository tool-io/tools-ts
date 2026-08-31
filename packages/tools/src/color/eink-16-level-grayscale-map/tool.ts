import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, quantize, fraction } from "../batch-shared.js";
export type Input = Readonly<{
  readonly normalizedGrayFractions: readonly number[];
  readonly callerBlackIsZero: boolean;
}>;
export type Output = Readonly<{
  readonly sixteenLevelCodes: readonly number[];
  readonly reconstructedGrayFractions: readonly number[];
}>;
const inputFields = [
  {
    id: "normalizedGrayFractions",
    label: "Normalized gray fractions",
    kind: "numberList",
  },
  { id: "callerBlackIsZero", label: "Caller black is zero", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.normalizedGrayFractions.forEach((v) => fraction(v, "gray"));
  const indices = input.normalizedGrayFractions.map((v) => quantize(v, 16));
  return {
    sixteenLevelCodes: indices.map((v) =>
      input.callerBlackIsZero ? v : 15 - v,
    ),
    reconstructedGrayFractions: indices.map((v) => v / 15),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  normalizedGrayFractions: [0, 0.5, 1],
  callerBlackIsZero: true,
} satisfies Input;
export const exampleOutput = {
  sixteenLevelCodes: [0, 8, 15],
  reconstructedGrayFractions: [0, 0.5333333333333333, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/eink-16-level-grayscale-map",
  title: "E-Ink 16-Level Grayscale Map",
  description:
    "Quantize actual normalized grayscale to sixteen levels with half-up ties and explicit device code polarity; no e-ink waveform/ghosting model, RGB luminance interpretation or specific panel protocol.",
  inputs: inputFields,
  outputs: [
    {
      id: "sixteenLevelCodes",
      label: "Sixteen level codes",
      kind: "numberList",
    },
    {
      id: "reconstructedGrayFractions",
      label: "Reconstructed gray fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      normalizedGrayFractions:
        value.normalizedGrayFractions as readonly number[],
      callerBlackIsZero: value.callerBlackIsZero as boolean,
    }),
});
export const run = tool.execute;
export default tool;
