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
  monotone,
  crossing,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly positiveVoltageSweepV: readonly number[];
  readonly positiveSweepCurrentMa: readonly number[];
  readonly negativeVoltageMagnitudesV: readonly number[];
  readonly negativeSweepCurrentMagnitudesMa: readonly number[];
  readonly callerBreakoverDetectionCurrentMa: number;
}>;
export type Output = Readonly<{
  readonly observedPositiveBreakoverV: number;
  readonly observedNegativeBreakoverMagnitudeV: number;
  readonly signedBreakoverAsymmetryV: number;
}>;
const inputFields = [
  {
    id: "positiveVoltageSweepV",
    label: "Positive voltage sweep v",
    kind: "numberList",
  },
  {
    id: "positiveSweepCurrentMa",
    label: "Positive sweep current ma",
    kind: "numberList",
  },
  {
    id: "negativeVoltageMagnitudesV",
    label: "Negative voltage magnitudes v",
    kind: "numberList",
  },
  {
    id: "negativeSweepCurrentMagnitudesMa",
    label: "Negative sweep current magnitudes ma",
    kind: "numberList",
  },
  {
    id: "callerBreakoverDetectionCurrentMa",
    label: "Caller breakover detection current ma",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerBreakoverDetectionCurrentMa,
    "callerBreakoverDetectionCurrentMa",
  );
  input.positiveVoltageSweepV.forEach((v) =>
    nonnegative(v, "positiveVoltageSweepV"),
  );
  input.positiveSweepCurrentMa.forEach((v) =>
    nonnegative(v, "positiveSweepCurrentMa"),
  );
  input.negativeVoltageMagnitudesV.forEach((v) =>
    nonnegative(v, "negativeVoltageMagnitudesV"),
  );
  input.negativeSweepCurrentMagnitudesMa.forEach((v) =>
    nonnegative(v, "negativeSweepCurrentMagnitudesMa"),
  );
  monotone(input.positiveSweepCurrentMa, "up", "current");
  monotone(input.negativeSweepCurrentMagnitudesMa, "up", "current");
  const plus = crossing(
      input.positiveVoltageSweepV,
      input.positiveSweepCurrentMa,
      input.callerBreakoverDetectionCurrentMa,
    ),
    minus = crossing(
      input.negativeVoltageMagnitudesV,
      input.negativeSweepCurrentMagnitudesMa,
      input.callerBreakoverDetectionCurrentMa,
    );
  if (!plus.found || !minus.found)
    simpleError(
      "sweeps",
      "Both directional breakover detection thresholds must be bracketed.",
    );
  return {
    observedPositiveBreakoverV: plus.value,
    observedNegativeBreakoverMagnitudeV: minus.value,
    signedBreakoverAsymmetryV: plus.value - minus.value,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  positiveVoltageSweepV: [20, 30, 40],
  positiveSweepCurrentMa: [0, 1, 9],
  negativeVoltageMagnitudesV: [20, 30, 40],
  negativeSweepCurrentMagnitudesMa: [0, 1, 5],
  callerBreakoverDetectionCurrentMa: 5,
} satisfies Input;
export const exampleOutput = {
  observedPositiveBreakoverV: 35,
  observedNegativeBreakoverMagnitudeV: 40,
  signedBreakoverAsymmetryV: -5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/diacs-breakover-voltage",
  title: "Diacs Breakover Voltage Calculator",
  description:
    "Extract two observed DIAC sweep thresholds from caller current criterion and compare directional asymmetry; threshold evidence not an ideal device knee model, unsafe test instructions or a universal DB3 voltage.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPositiveBreakoverV",
      label: "Observed positive breakover v",
      kind: "number",
    },
    {
      id: "observedNegativeBreakoverMagnitudeV",
      label: "Observed negative breakover magnitude v",
      kind: "number",
    },
    {
      id: "signedBreakoverAsymmetryV",
      label: "Signed breakover asymmetry v",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      positiveVoltageSweepV: value.positiveVoltageSweepV as readonly number[],
      positiveSweepCurrentMa: value.positiveSweepCurrentMa as readonly number[],
      negativeVoltageMagnitudesV:
        value.negativeVoltageMagnitudesV as readonly number[],
      negativeSweepCurrentMagnitudesMa:
        value.negativeSweepCurrentMagnitudesMa as readonly number[],
      callerBreakoverDetectionCurrentMa:
        value.callerBreakoverDetectionCurrentMa as number,
    }),
});
export const run = tool.execute;
export default tool;
