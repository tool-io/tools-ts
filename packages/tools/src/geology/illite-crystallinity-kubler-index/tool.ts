import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedIllitePeakFwhmDegrees: number;
  readonly independentInstrumentFwhmDegrees: number;
}>;
export type Output = Readonly<{
  readonly gaussianCorrectedKublerDegrees: number;
}>;
const inputFields = [
  {
    id: "observedIllitePeakFwhmDegrees",
    label: "Observed illite peak fwhm degrees",
    kind: "number",
  },
  {
    id: "independentInstrumentFwhmDegrees",
    label: "Independent instrument fwhm degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.observedIllitePeakFwhmDegrees,
    "observedIllitePeakFwhmDegrees",
  );
  nonnegative(
    input.independentInstrumentFwhmDegrees,
    "independentInstrumentFwhmDegrees",
  );
  if (
    input.independentInstrumentFwhmDegrees > input.observedIllitePeakFwhmDegrees
  )
    simpleError("width", "Observed width≥instrument Gaussian broadening.");
  return {
    gaussianCorrectedKublerDegrees: Math.sqrt(
      input.observedIllitePeakFwhmDegrees ** 2 -
        input.independentInstrumentFwhmDegrees ** 2,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIllitePeakFwhmDegrees: 0.5,
  independentInstrumentFwhmDegrees: 0.3,
} satisfies Input;
export const exampleOutput = {
  gaussianCorrectedKublerDegrees: 0.4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/illite-crystallinity-kubler-index",
  title: "Geology Illite Crystallinity Kubler Index Calculator",
  description:
    "Observed illite001FWHM2theta Gaussian instrument correction; same-standard preparation required, no metamorphic grade or Gaussian assumption inferred. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "gaussianCorrectedKublerDegrees",
      label: "Gaussian corrected kubler degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIllitePeakFwhmDegrees:
        value.observedIllitePeakFwhmDegrees as number,
      independentInstrumentFwhmDegrees:
        value.independentInstrumentFwhmDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
