import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, fraction } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly backdropEncodedChannels: readonly number[];
  readonly sourceEncodedChannels: readonly number[];
}>;
export type Output = Readonly<{
  readonly differenceEncodedChannels: readonly number[];
}>;
const inputFields = [
  {
    id: "backdropEncodedChannels",
    label: "Backdrop encoded channels",
    kind: "numberList",
  },
  {
    id: "sourceEncodedChannels",
    label: "Source encoded channels",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.backdropEncodedChannels.forEach((v) =>
    fraction(v, "backdropEncodedChannels"),
  );
  input.sourceEncodedChannels.forEach((v) =>
    fraction(v, "sourceEncodedChannels"),
  );
  if (
    input.backdropEncodedChannels.length !== 3 ||
    input.sourceEncodedChannels.length !== 3
  )
    simpleError(
      "channels",
      "Three already same blending-space channels with opaque input.",
    );
  return {
    differenceEncodedChannels: input.backdropEncodedChannels.map((v, i) =>
      Math.abs(v - input.sourceEncodedChannels[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  backdropEncodedChannels: [0.2, 0.5, 0.9],
  sourceEncodedChannels: [1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  differenceEncodedChannels: [0.8, 0.5, 0.1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/mix-blend-mode-difference-inversion-note",
  title: "mix-blend-mode:difference Inversion Note",
  description:
    "Opaque same-space difference blend |Cb−Cs|; white source gives inversion, unlike universal invert of arbitrary source/alpha. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "differenceEncodedChannels",
      label: "Difference encoded channels",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      backdropEncodedChannels:
        value.backdropEncodedChannels as readonly number[],
      sourceEncodedChannels: value.sourceEncodedChannels as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
