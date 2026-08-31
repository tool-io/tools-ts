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
  bounded,
  sum,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedCausalChannelImpulse: readonly number[];
  readonly callerTapCount: number;
  readonly callerMaximumAbsoluteFfeWeight: number;
}>;
export type Output = Readonly<{
  readonly idealCausalInverseFfeTaps: readonly number[];
  readonly combinedChannelEqualizerImpulse: readonly number[];
  readonly tailEnergyBeyondDesignedCursorSamples: number;
}>;
const inputFields = [
  {
    id: "observedCausalChannelImpulse",
    label: "Observed causal channel impulse",
    kind: "numberList",
  },
  { id: "callerTapCount", label: "Caller tap count", kind: "number" },
  {
    id: "callerMaximumAbsoluteFfeWeight",
    label: "Caller maximum absolute ffe weight",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMaximumAbsoluteFfeWeight,
    "callerMaximumAbsoluteFfeWeight",
  );
  bounded(input.callerTapCount, "taps", 1, 64);
  if (
    !input.observedCausalChannelImpulse.length ||
    input.observedCausalChannelImpulse.length > 64 ||
    input.observedCausalChannelImpulse[0] === 0
  )
    simpleError(
      "channel",
      "1–64 causal samples with nonzero leading cursor required.",
    );
  const h = input.observedCausalChannelImpulse,
    taps: number[] = [];
  for (let n = 0; n < input.callerTapCount; n++) {
    let v = n === 0 ? 1 : 0;
    for (let j = 1; j <= n && j < h.length; j++) v -= h[j] * taps[n - j];
    v /= h[0];
    if (
      !Number.isFinite(v) ||
      Math.abs(v) > input.callerMaximumAbsoluteFfeWeight
    )
      simpleError(
        "taps",
        "Ideal inverse exceeds caller tap range; unstable/unsupported causal inverse.",
      );
    taps.push(v);
  }
  const combined = Array<number>(h.length + taps.length - 1).fill(0);
  h.forEach((v, i) => taps.forEach((t, j) => (combined[i + j] += v * t)));
  return {
    idealCausalInverseFfeTaps: taps,
    combinedChannelEqualizerImpulse: combined,
    tailEnergyBeyondDesignedCursorSamples: sum(
      combined.slice(taps.length).map((v) => v * v),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCausalChannelImpulse: [1, 0.5],
  callerTapCount: 3,
  callerMaximumAbsoluteFfeWeight: 2,
} satisfies Input;
export const exampleOutput = {
  idealCausalInverseFfeTaps: [1, -0.5, 0.25],
  combinedChannelEqualizerImpulse: [1, 0, 0, 0.125],
  tailEnergyBeyondDesignedCursorSamples: 0.015625,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/ffe-tap-weight",
  title: "Ffe Tap Weight Calculator",
  description:
    "Design bounded finite causal zero-forcing inverse FFE from observed impulse, explicitly exposing truncated residual tail; not DFE feedback, arbitrary precursor/MMSE design or a noise-amplification/BER guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealCausalInverseFfeTaps",
      label: "Ideal causal inverse ffe taps",
      kind: "numberList",
    },
    {
      id: "combinedChannelEqualizerImpulse",
      label: "Combined channel equalizer impulse",
      kind: "numberList",
    },
    {
      id: "tailEnergyBeyondDesignedCursorSamples",
      label: "Tail energy beyond designed cursor samples",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCausalChannelImpulse:
        value.observedCausalChannelImpulse as readonly number[],
      callerTapCount: value.callerTapCount as number,
      callerMaximumAbsoluteFfeWeight:
        value.callerMaximumAbsoluteFfeWeight as number,
    }),
});
export const run = tool.execute;
export default tool;
