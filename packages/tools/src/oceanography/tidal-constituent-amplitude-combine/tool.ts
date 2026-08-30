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
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly timesHours: readonly number[];
  readonly constituentAmplitudesM: readonly number[];
  readonly constituentPeriodsHours: readonly number[];
  readonly constituentPhasesDegrees: readonly number[];
  readonly datumOffsetM: number;
}>;
export type Output = Readonly<{
  readonly predictedHeightsM: readonly number[];
}>;
const inputFields = [
  { id: "timesHours", label: "Times hours", kind: "numberList" },
  {
    id: "constituentAmplitudesM",
    label: "Constituent amplitudes m",
    kind: "numberList",
  },
  {
    id: "constituentPeriodsHours",
    label: "Constituent periods hours",
    kind: "numberList",
  },
  {
    id: "constituentPhasesDegrees",
    label: "Constituent phases degrees",
    kind: "numberList",
  },
  { id: "datumOffsetM", label: "Datum offset m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.constituentPeriodsHours.forEach((v) =>
    positive(v, "constituentPeriodsHours"),
  );
  input.constituentAmplitudesM.forEach((v) =>
    nonnegative(v, "constituentAmplitudesM"),
  );
  aligned(
    input.constituentAmplitudesM,
    input.constituentPeriodsHours,
    "constituentAmplitudesM",
  );
  aligned(
    input.constituentAmplitudesM,
    input.constituentPhasesDegrees,
    "constituentAmplitudesM",
  );
  if (
    !input.timesHours.length ||
    input.timesHours.length * input.constituentAmplitudesM.length > 1000000
  )
    simpleError(
      "timesHours",
      "Nonempty times and at most one million constituent evaluations required.",
    );
  return {
    predictedHeightsM: input.timesHours.map((t) =>
      input.constituentAmplitudesM.reduce(
        (s, a, i) =>
          s +
          a *
            Math.cos(
              (2 * Math.PI * t) / input.constituentPeriodsHours[i] +
                (input.constituentPhasesDegrees[i] * Math.PI) / 180,
            ),
        input.datumOffsetM,
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesHours: [0, 1, 2],
  constituentAmplitudesM: [1, 0.5],
  constituentPeriodsHours: [4, 2],
  constituentPhasesDegrees: [0, 0],
  datumOffsetM: 1,
} satisfies Input;
export const exampleOutput = {
  predictedHeightsM: [2.5, 0.5, 0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/tidal-constituent-amplitude-combine",
  title: "Tidal Constituent Amplitude Combiner",
  description:
    "Synthesize supplied harmonic tidal constituents with explicit phase/time datum; not a fixed six-hour cosine interpolation or prediction of surge residuals.",
  inputs: inputFields,
  outputs: [
    {
      id: "predictedHeightsM",
      label: "Predicted heights m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      timesHours: value.timesHours as readonly number[],
      constituentAmplitudesM: value.constituentAmplitudesM as readonly number[],
      constituentPeriodsHours:
        value.constituentPeriodsHours as readonly number[],
      constituentPhasesDegrees:
        value.constituentPhasesDegrees as readonly number[],
      datumOffsetM: value.datumOffsetM as number,
    }),
});
export const run = tool.execute;
export default tool;
