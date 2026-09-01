import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
  catalogIndex,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerBopPerilIds: readonly string[];
  readonly callerVerifiedIncludedPerilFlags: readonly number[];
  readonly observedLossPerilIds: readonly string[];
  readonly lossPerilEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerIncludedObservedPerilIds: readonly string[];
  readonly callerExcludedObservedPerilIds: readonly string[];
  readonly unknownLossPerilIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerBopPerilIds",
    label: "Caller bop peril ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedIncludedPerilFlags",
    label: "Caller verified included peril flags",
    kind: "numberList",
  },
  {
    id: "observedLossPerilIds",
    label: "Observed loss peril ids",
    kind: "stringList",
  },
  {
    id: "lossPerilEvidenceFlags",
    label: "Loss peril evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerBopPerilIds, "perils");
  aligned(
    input.callerBopPerilIds,
    input.callerVerifiedIncludedPerilFlags,
    "catalog",
  );
  aligned(input.observedLossPerilIds, input.lossPerilEvidenceFlags, "evidence");
  binary(input.callerVerifiedIncludedPerilFlags, "perils");
  binary(input.lossPerilEvidenceFlags, "evidence");
  const included: string[] = [],
    excluded: string[] = [],
    unknown: string[] = [];
  input.observedLossPerilIds.forEach((v, i) => {
    if (!input.lossPerilEvidenceFlags[i]) unknown.push(v);
    else
      (input.callerVerifiedIncludedPerilFlags[
        catalogIndex(input.callerBopPerilIds, v)
      ]
        ? included
        : excluded
      ).push(v);
  });
  return {
    callerIncludedObservedPerilIds: included,
    callerExcludedObservedPerilIds: excluded,
    unknownLossPerilIds: unknown,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerBopPerilIds: ["fire", "flood"],
  callerVerifiedIncludedPerilFlags: [1, 0],
  observedLossPerilIds: ["fire", "flood"],
  lossPerilEvidenceFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  callerIncludedObservedPerilIds: ["fire"],
  callerExcludedObservedPerilIds: [],
  unknownLossPerilIds: ["flood"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/bop-package-included-perils-lookup",
  title: "BOP Package Included Perils Lookup",
  description:
    "Audit actual BOP loss-peril annotations against caller verified included-peril map, unknown cause evidence separate; no universal BOP package contents, causation or coverage verdict.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerIncludedObservedPerilIds",
      label: "Caller included observed peril ids",
      kind: "stringList",
    },
    {
      id: "callerExcludedObservedPerilIds",
      label: "Caller excluded observed peril ids",
      kind: "stringList",
    },
    {
      id: "unknownLossPerilIds",
      label: "Unknown loss peril ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerBopPerilIds: value.callerBopPerilIds as readonly string[],
      callerVerifiedIncludedPerilFlags:
        value.callerVerifiedIncludedPerilFlags as readonly number[],
      observedLossPerilIds: value.observedLossPerilIds as readonly string[],
      lossPerilEvidenceFlags: value.lossPerilEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
