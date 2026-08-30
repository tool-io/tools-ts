import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  ordered,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly frequenciesHz: readonly number[];
  readonly thresholdsDbHl: readonly number[];
  readonly selectedFrequenciesHz: readonly number[];
}>;
export type Output = Readonly<{
  readonly selectedThresholdsDbHl: readonly number[];
  readonly pureToneAverageDbHl: number;
}>;
const inputFields = [
  { id: "frequenciesHz", label: "Frequencies hz", kind: "numberList" },
  { id: "thresholdsDbHl", label: "Thresholds db hl", kind: "numberList" },
  {
    id: "selectedFrequenciesHz",
    label: "Selected frequencies hz",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.frequenciesHz, input.thresholdsDbHl, "frequenciesHz");
  ordered(input.frequenciesHz, "frequenciesHz");
  input.frequenciesHz.forEach((v) => positive(v, "frequenciesHz"));
  if (
    !input.selectedFrequenciesHz.length ||
    new Set(input.selectedFrequenciesHz).size !==
      input.selectedFrequenciesHz.length
  )
    simpleError(
      "selectedFrequenciesHz",
      "Distinct nonempty selected frequencies required.",
    );
  const selectedThresholdsDbHl = input.selectedFrequenciesHz.map((v) => {
    const index = input.frequenciesHz.indexOf(v);
    if (index < 0)
      simpleError(
        "selectedFrequenciesHz",
        "Each selected frequency must have a measured threshold.",
      );
    return input.thresholdsDbHl[index];
  });
  return {
    selectedThresholdsDbHl,
    pureToneAverageDbHl: mean(selectedThresholdsDbHl),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  frequenciesHz: [250, 500, 1000, 2000],
  thresholdsDbHl: [10, 20, 30, 40],
  selectedFrequenciesHz: [500, 1000, 2000],
} satisfies Input;
export const exampleOutput = {
  selectedThresholdsDbHl: [20, 30, 40],
  pureToneAverageDbHl: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/audiogram-frequency-pta",
  title: "Pure Tone Average Audiogram",
  description:
    "Select caller-defined measured audiogram frequencies and calculate PTA without embedding a jurisdictional impairment formula.",
  inputs: inputFields,
  outputs: [
    {
      id: "selectedThresholdsDbHl",
      label: "Selected thresholds db hl",
      kind: "numberList",
    },
    {
      id: "pureToneAverageDbHl",
      label: "Pure tone average db hl",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      frequenciesHz: value.frequenciesHz as readonly number[],
      thresholdsDbHl: value.thresholdsDbHl as readonly number[],
      selectedFrequenciesHz: value.selectedFrequenciesHz as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
