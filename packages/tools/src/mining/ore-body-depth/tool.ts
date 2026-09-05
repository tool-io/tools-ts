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
  readonly observedOreDepthUpperContactDepthM: readonly number[];
  readonly observedOreDepthLowerContactDepthM: readonly number[];
  readonly knownOreDepthContactPairFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownContactThicknessM: readonly number[];
  readonly unknownContactPairCount: number;
}>;
const inputFields = [
  {
    id: "observedOreDepthUpperContactDepthM",
    label: "Observed ore depth upper contact depth m",
    kind: "numberList",
  },
  {
    id: "observedOreDepthLowerContactDepthM",
    label: "Observed ore depth lower contact depth m",
    kind: "numberList",
  },
  {
    id: "knownOreDepthContactPairFlags",
    label: "Known ore depth contact pair flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedOreDepthUpperContactDepthM.forEach((v) =>
    nonnegative(v, "observedOreDepthUpperContactDepthM"),
  );
  input.observedOreDepthLowerContactDepthM.forEach((v) =>
    nonnegative(v, "observedOreDepthLowerContactDepthM"),
  );
  binary(input.knownOreDepthContactPairFlags, "knownOreDepthContactPairFlags");
  aligned(
    input.observedOreDepthUpperContactDepthM,
    input.observedOreDepthLowerContactDepthM,
    "observedOreDepthUpperContactDepthM",
  );
  aligned(
    input.observedOreDepthUpperContactDepthM,
    input.knownOreDepthContactPairFlags,
    "observedOreDepthUpperContactDepthM",
  );
  const known = input.observedOreDepthUpperContactDepthM.flatMap((v, i) => {
    if (!input.knownOreDepthContactPairFlags[i]) return [];
    const t = input.observedOreDepthLowerContactDepthM[i] - v;
    nonnegative(t, "contact chronology");
    return [t];
  });
  return {
    knownContactThicknessM: known,
    unknownContactPairCount: input.knownOreDepthContactPairFlags.filter(
      (v) => !v,
    ).length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOreDepthUpperContactDepthM: [10, 20],
  observedOreDepthLowerContactDepthM: [15, 30],
  knownOreDepthContactPairFlags: [1, 0],
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
  id: "mining/ore-body-depth",
  title: "Ore Body Depth Calculator",
  description:
    "Audit independently identified OreDepth paired contact-depth observations separately from unresolved contacts; depths share caller datum and section conventions, no geological correlation or geodesy. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedOreDepthUpperContactDepthM:
        value.observedOreDepthUpperContactDepthM as readonly number[],
      observedOreDepthLowerContactDepthM:
        value.observedOreDepthLowerContactDepthM as readonly number[],
      knownOreDepthContactPairFlags:
        value.knownOreDepthContactPairFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
