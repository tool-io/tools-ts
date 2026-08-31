import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  binary,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly patchAreasM2: readonly number[];
  readonly observedNetBalancesMwe: readonly number[];
  readonly balanceEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedAblationAreaM2: number;
  readonly observedNonAblatingAreaM2: number;
  readonly unknownAreaM2: number;
  readonly ablationShareOfKnownAreaFraction: number;
}>;
const inputFields = [
  { id: "patchAreasM2", label: "Patch areas m2", kind: "numberList" },
  {
    id: "observedNetBalancesMwe",
    label: "Observed net balances mwe",
    kind: "numberList",
  },
  {
    id: "balanceEvidenceFlags",
    label: "Balance evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.patchAreasM2.forEach((v) => positive(v, "patchAreasM2"));
  binary(input.balanceEvidenceFlags, "balanceEvidenceFlags");
  aligned(input.patchAreasM2, input.observedNetBalancesMwe, "patchAreasM2");
  aligned(input.patchAreasM2, input.balanceEvidenceFlags, "patchAreasM2");
  let negative = 0,
    other = 0,
    unknown = 0;
  input.patchAreasM2.forEach((v, i) => {
    if (!input.balanceEvidenceFlags[i]) unknown += v;
    else if (input.observedNetBalancesMwe[i] < 0) negative += v;
    else other += v;
  });
  return {
    observedAblationAreaM2: negative,
    observedNonAblatingAreaM2: other,
    unknownAreaM2: unknown,
    ablationShareOfKnownAreaFraction:
      negative + other ? negative / (negative + other) : -1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  patchAreasM2: [10, 20, 30],
  observedNetBalancesMwe: [-1, 0, 1],
  balanceEvidenceFlags: [1, 1, 0],
} satisfies Input;
export const exampleOutput = {
  observedAblationAreaM2: 10,
  observedNonAblatingAreaM2: 20,
  unknownAreaM2: 30,
  ablationShareOfKnownAreaFraction: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/ablation-zone-extent",
  title: "Ablation Zone Extent Calculator",
  description:
    "Audit actual negative-balance ablation patches with observed classification flags and unknown area separate; not elevation-derived AAR or a guessed ablation boundary.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedAblationAreaM2",
      label: "Observed ablation area m2",
      kind: "number",
    },
    {
      id: "observedNonAblatingAreaM2",
      label: "Observed non ablating area m2",
      kind: "number",
    },
    { id: "unknownAreaM2", label: "Unknown area m2", kind: "number" },
    {
      id: "ablationShareOfKnownAreaFraction",
      label: "Ablation share of known area fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      patchAreasM2: value.patchAreasM2 as readonly number[],
      observedNetBalancesMwe: value.observedNetBalancesMwe as readonly number[],
      balanceEvidenceFlags: value.balanceEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
