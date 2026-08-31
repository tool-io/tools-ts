import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, rgb, bounded, shape } from "../batch-shared.js";
export type Input = Readonly<{
  readonly rgbByteTriples: readonly (readonly number[])[];
  readonly observedWireBytes: readonly number[];
}>;
export type Output = Readonly<{
  readonly expectedGrbWireBytes: readonly number[];
  readonly mismatchedWireByteIndices: readonly number[];
  readonly observedByteCountMatches: boolean;
}>;
const inputFields = [
  { id: "rgbByteTriples", label: "Rgb byte triples", kind: "matrix" },
  { id: "observedWireBytes", label: "Observed wire bytes", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.rgbByteTriples.length || shape(input.rgbByteTriples, "rgb") !== 3)
    simpleError("rgb", "Nonempty bounded RGB byte rows required.");
  input.rgbByteTriples.forEach((r) =>
    r.forEach((v) => bounded(v, "byte", 0, 255)),
  );
  input.observedWireBytes.forEach((v) => bounded(v, "wireByte", 0, 255));
  const expected = input.rgbByteTriples.flatMap(([r, g, b]) => [g, r, b]),
    length = Math.max(expected.length, input.observedWireBytes.length),
    mismatches = Array.from({ length }, (_, i) => i).filter(
      (i) => expected[i] !== input.observedWireBytes[i],
    );
  return {
    expectedGrbWireBytes: expected,
    mismatchedWireByteIndices: mismatches,
    observedByteCountMatches:
      expected.length === input.observedWireBytes.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rgbByteTriples: [
    [10, 20, 30],
    [255, 0, 1],
  ],
  observedWireBytes: [20, 10, 30, 0, 255, 1],
} satisfies Input;
export const exampleOutput = {
  expectedGrbWireBytes: [20, 10, 30, 0, 255, 1],
  mismatchedWireByteIndices: [],
  observedByteCountMatches: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/ws2812-led-byte-order-grb-checker",
  title: "WS2812 GRB Byte Order Check",
  description:
    "Serialize actual RGB bytes into declared WS2812 GRB order and audit observed sequence including missing/extra bytes; no electrical timing, chip-variant auto-detection or hardware write is performed.",
  inputs: inputFields,
  outputs: [
    {
      id: "expectedGrbWireBytes",
      label: "Expected grb wire bytes",
      kind: "numberList",
    },
    {
      id: "mismatchedWireByteIndices",
      label: "Mismatched wire byte indices",
      kind: "numberList",
    },
    {
      id: "observedByteCountMatches",
      label: "Observed byte count matches",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      rgbByteTriples: value.rgbByteTriples as readonly (readonly number[])[],
      observedWireBytes: value.observedWireBytes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
