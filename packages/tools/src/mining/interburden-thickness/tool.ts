import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedInterburdenUpperContactDepthM: readonly number[];
  readonly observedInterburdenLowerContactDepthM: readonly number[];
  readonly knownInterburdenContactPairFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownContactThicknessM: readonly number[];
  readonly unknownContactPairCount: number;
}>;
const inputFields = [
  {
    id: "observedInterburdenUpperContactDepthM",
    label: "Observed interburden upper contact depth m",
    kind: "numberList",
  },
  {
    id: "observedInterburdenLowerContactDepthM",
    label: "Observed interburden lower contact depth m",
    kind: "numberList",
  },
  {
    id: "knownInterburdenContactPairFlags",
    label: "Known interburden contact pair flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedInterburdenUpperContactDepthM.forEach((v) =>
    nonnegative(v, "observedInterburdenUpperContactDepthM"),
  );
  input.observedInterburdenLowerContactDepthM.forEach((v) =>
    nonnegative(v, "observedInterburdenLowerContactDepthM"),
  );
  binary(
    input.knownInterburdenContactPairFlags,
    "knownInterburdenContactPairFlags",
  );
  aligned(
    input.observedInterburdenUpperContactDepthM,
    input.observedInterburdenLowerContactDepthM,
    "observedInterburdenUpperContactDepthM",
  );
  aligned(
    input.observedInterburdenUpperContactDepthM,
    input.knownInterburdenContactPairFlags,
    "observedInterburdenUpperContactDepthM",
  );
  const known = input.observedInterburdenUpperContactDepthM.flatMap((v, i) => {
    if (!input.knownInterburdenContactPairFlags[i]) return [];
    const t = input.observedInterburdenLowerContactDepthM[i] - v;
    nonnegative(t, "contact chronology");
    return [t];
  });
  return {
    knownContactThicknessM: known,
    unknownContactPairCount: input.knownInterburdenContactPairFlags.filter(
      (v) => !v,
    ).length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedInterburdenUpperContactDepthM: [10, 20],
  observedInterburdenLowerContactDepthM: [15, 30],
  knownInterburdenContactPairFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  knownContactThicknessM: [5],
  unknownContactPairCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/interburden-thickness",
  title: "Interburden Thickness Calculator",
  description:
    "Audit independently identified Interburden paired contact-depth observations separately from unresolved contacts; depths share caller datum and section conventions, no geological correlation or geodesy. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownContactThicknessM",
      label: "Known contact thickness m",
      kind: "numberList",
    },
    {
      id: "unknownContactPairCount",
      label: "Unknown contact pair count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedInterburdenUpperContactDepthM:
        value.observedInterburdenUpperContactDepthM as readonly number[],
      observedInterburdenLowerContactDepthM:
        value.observedInterburdenLowerContactDepthM as readonly number[],
      knownInterburdenContactPairFlags:
        value.knownInterburdenContactPairFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
