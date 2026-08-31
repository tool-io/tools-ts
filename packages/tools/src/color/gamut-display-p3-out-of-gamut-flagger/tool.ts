import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  rgb,
  decode,
  linearP3ToSrgb,
  inGamut,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly encodedDisplayP3Channels: readonly number[];
}>;
export type Output = Readonly<{
  readonly unclippedLinearSrgbChannels: readonly number[];
  readonly outsideSrgbGamut: boolean;
  readonly outsideChannelIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "encodedDisplayP3Channels",
    label: "Encoded display p3 channels",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  rgb(input.encodedDisplayP3Channels);
  const raw = linearP3ToSrgb(input.encodedDisplayP3Channels.map(decode));
  return {
    unclippedLinearSrgbChannels: raw,
    outsideSrgbGamut: !inGamut(raw, 1e-7),
    outsideChannelIndices: raw.flatMap((v, i) =>
      v < -1e-7 || v > 1 + 1e-7 ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  encodedDisplayP3Channels: [1, 0, 0],
} satisfies Input;
export const exampleOutput = {
  unclippedLinearSrgbChannels: [1.2249401763, -0.0420569547, -0.0196375546],
  outsideSrgbGamut: true,
  outsideChannelIndices: [0, 1, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/gamut-display-p3-out-of-gamut-flagger",
  title: "Display-P3 Out-of-Gamut Flagger",
  description:
    "Transform gamma-encoded Display-P3 D65 into unclipped linear sRGB and expose excursions under fixed 1e-7 numerical tolerance; not clipping, ICC-profile conversion, HDR transfer or percentage gamut coverage.",
  inputs: inputFields,
  outputs: [
    {
      id: "unclippedLinearSrgbChannels",
      label: "Unclipped linear srgb channels",
      kind: "numberList",
    },
    { id: "outsideSrgbGamut", label: "Outside srgb gamut", kind: "boolean" },
    {
      id: "outsideChannelIndices",
      label: "Outside channel indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      encodedDisplayP3Channels:
        value.encodedDisplayP3Channels as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
