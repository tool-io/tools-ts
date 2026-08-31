import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly referenceVerticalEyeOpeningV: number;
  readonly observedVerticalEyeOpeningV: number;
  readonly referenceHorizontalEyeOpeningUi: number;
  readonly observedHorizontalEyeOpeningUi: number;
}>;
export type Output = Readonly<{
  readonly verticalEyeClosureFraction: number;
  readonly horizontalEyeClosureFraction: number;
  readonly amplitudeEquivalentEyePenaltyDb: number;
}>;
const inputFields = [
  {
    id: "referenceVerticalEyeOpeningV",
    label: "Reference vertical eye opening v",
    kind: "number",
  },
  {
    id: "observedVerticalEyeOpeningV",
    label: "Observed vertical eye opening v",
    kind: "number",
  },
  {
    id: "referenceHorizontalEyeOpeningUi",
    label: "Reference horizontal eye opening ui",
    kind: "number",
  },
  {
    id: "observedHorizontalEyeOpeningUi",
    label: "Observed horizontal eye opening ui",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.referenceVerticalEyeOpeningV, "referenceVerticalEyeOpeningV");
  positive(input.observedVerticalEyeOpeningV, "observedVerticalEyeOpeningV");
  positive(
    input.referenceHorizontalEyeOpeningUi,
    "referenceHorizontalEyeOpeningUi",
  );
  positive(
    input.observedHorizontalEyeOpeningUi,
    "observedHorizontalEyeOpeningUi",
  );
  return {
    verticalEyeClosureFraction:
      1 -
      input.observedVerticalEyeOpeningV / input.referenceVerticalEyeOpeningV,
    horizontalEyeClosureFraction:
      1 -
      input.observedHorizontalEyeOpeningUi /
        input.referenceHorizontalEyeOpeningUi,
    amplitudeEquivalentEyePenaltyDb:
      20 *
      Math.log10(
        input.referenceVerticalEyeOpeningV / input.observedVerticalEyeOpeningV,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceVerticalEyeOpeningV: 1,
  observedVerticalEyeOpeningV: 0.5,
  referenceHorizontalEyeOpeningUi: 1,
  observedHorizontalEyeOpeningUi: 0.75,
} satisfies Input;
export const exampleOutput = {
  verticalEyeClosureFraction: 0.5,
  horizontalEyeClosureFraction: 0.25,
  amplitudeEquivalentEyePenaltyDb: 6.020599913279624,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/eye-closure-penalty",
  title: "Eye Closure Penalty Calculator",
  description:
    "Audit actual eye-opening loss versus measured reference in voltage/UI and amplitude-equivalent dB; negative closure/improvement retained, not optical power penalty, calibrated BER or receiver margin.",
  inputs: inputFields,
  outputs: [
    {
      id: "verticalEyeClosureFraction",
      label: "Vertical eye closure fraction",
      kind: "number",
    },
    {
      id: "horizontalEyeClosureFraction",
      label: "Horizontal eye closure fraction",
      kind: "number",
    },
    {
      id: "amplitudeEquivalentEyePenaltyDb",
      label: "Amplitude equivalent eye penalty db",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceVerticalEyeOpeningV:
        value.referenceVerticalEyeOpeningV as number,
      observedVerticalEyeOpeningV: value.observedVerticalEyeOpeningV as number,
      referenceHorizontalEyeOpeningUi:
        value.referenceHorizontalEyeOpeningUi as number,
      observedHorizontalEyeOpeningUi:
        value.observedHorizontalEyeOpeningUi as number,
    }),
});
export const run = tool.execute;
export default tool;
