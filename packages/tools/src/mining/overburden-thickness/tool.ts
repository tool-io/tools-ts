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
  readonly observedOverburdenUpperContactDepthM: readonly number[];
  readonly observedOverburdenLowerContactDepthM: readonly number[];
  readonly knownOverburdenContactPairFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownContactThicknessM: readonly number[];
  readonly unknownContactPairCount: number;
}>;
const inputFields = [
  {
    id: "observedOverburdenUpperContactDepthM",
    label: "Observed overburden upper contact depth m",
    kind: "numberList",
  },
  {
    id: "observedOverburdenLowerContactDepthM",
    label: "Observed overburden lower contact depth m",
    kind: "numberList",
  },
  {
    id: "knownOverburdenContactPairFlags",
    label: "Known overburden contact pair flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedOverburdenUpperContactDepthM.forEach((v) =>
    nonnegative(v, "observedOverburdenUpperContactDepthM"),
  );
  input.observedOverburdenLowerContactDepthM.forEach((v) =>
    nonnegative(v, "observedOverburdenLowerContactDepthM"),
  );
  binary(
    input.knownOverburdenContactPairFlags,
    "knownOverburdenContactPairFlags",
  );
  aligned(
    input.observedOverburdenUpperContactDepthM,
    input.observedOverburdenLowerContactDepthM,
    "observedOverburdenUpperContactDepthM",
  );
  aligned(
    input.observedOverburdenUpperContactDepthM,
    input.knownOverburdenContactPairFlags,
    "observedOverburdenUpperContactDepthM",
  );
  const known = input.observedOverburdenUpperContactDepthM.flatMap((v, i) => {
    if (!input.knownOverburdenContactPairFlags[i]) return [];
    const t = input.observedOverburdenLowerContactDepthM[i] - v;
    nonnegative(t, "contact chronology");
    return [t];
  });
  return {
    knownContactThicknessM: known,
    unknownContactPairCount: input.knownOverburdenContactPairFlags.filter(
      (v) => !v,
    ).length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOverburdenUpperContactDepthM: [10, 20],
  observedOverburdenLowerContactDepthM: [15, 30],
  knownOverburdenContactPairFlags: [1, 0],
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
  id: "mining/overburden-thickness",
  title: "Overburden Thickness Calculator",
  description:
    "Audit independently identified Overburden paired contact-depth observations separately from unresolved contacts; depths share caller datum and section conventions, no geological correlation or geodesy. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedOverburdenUpperContactDepthM:
        value.observedOverburdenUpperContactDepthM as readonly number[],
      observedOverburdenLowerContactDepthM:
        value.observedOverburdenLowerContactDepthM as readonly number[],
      knownOverburdenContactPairFlags:
        value.knownOverburdenContactPairFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
