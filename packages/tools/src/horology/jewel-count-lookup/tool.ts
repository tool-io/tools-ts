import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  nonnegative,
  bounded,
  aligned,
  binary,
  sumMoney,
  unique,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly componentLabels: readonly string[];
  readonly observedJewelCounts: readonly number[];
  readonly countEvidenceFlags: readonly number[];
  readonly callerAdvertisedJewelCount: number;
}>;
export type Output = Readonly<{
  readonly observedKnownJewelCount: number;
  readonly componentsWithMissingCounts: readonly string[];
  readonly completeInventoryEvidence: boolean;
  readonly signedCompleteInventoryMinusAdvertisedCount: number;
}>;
const inputFields = [
  { id: "componentLabels", label: "Component labels", kind: "stringList" },
  {
    id: "observedJewelCounts",
    label: "Observed jewel counts",
    kind: "numberList",
  },
  {
    id: "countEvidenceFlags",
    label: "Count evidence flags",
    kind: "numberList",
  },
  {
    id: "callerAdvertisedJewelCount",
    label: "Caller advertised jewel count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedJewelCounts.forEach((v) =>
    nonnegative(v, "observedJewelCounts"),
  );
  input.observedJewelCounts.forEach((v) => integer(v, "observedJewelCounts"));
  binary(input.countEvidenceFlags, "countEvidenceFlags");
  aligned(input.componentLabels, input.observedJewelCounts, "componentLabels");
  aligned(input.componentLabels, input.countEvidenceFlags, "componentLabels");
  unique(input.componentLabels, "components");
  bounded(input.callerAdvertisedJewelCount, "advertised", 0, 10000);
  const known = sumMoney(
      input.observedJewelCounts.filter(
        (_, i) => input.countEvidenceFlags[i] === 1,
      ),
    ),
    missing = input.componentLabels.filter(
      (_, i) => !input.countEvidenceFlags[i],
    );
  return {
    observedKnownJewelCount: known,
    componentsWithMissingCounts: missing,
    completeInventoryEvidence: missing.length === 0,
    signedCompleteInventoryMinusAdvertisedCount: missing.length
      ? -1
      : known - input.callerAdvertisedJewelCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  componentLabels: ["pivot", "bearing", "cap"],
  observedJewelCounts: [2, 4, 2],
  countEvidenceFlags: [1, 1, 0],
  callerAdvertisedJewelCount: 10,
} satisfies Input;
export const exampleOutput = {
  observedKnownJewelCount: 6,
  componentsWithMissingCounts: ["cap"],
  completeInventoryEvidence: false,
  signedCompleteInventoryMinusAdvertisedCount: -1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horology/jewel-count-lookup",
  title: "Jewel Count Lookup",
  description:
    "Audit actual component jewel inventory against caller advertised count while retaining missing count evidence and explicit unavailable comparison −1; no quality ranking, automatic model lookup or inference missing jewels are zero.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedKnownJewelCount",
      label: "Observed known jewel count",
      kind: "number",
    },
    {
      id: "componentsWithMissingCounts",
      label: "Components with missing counts",
      kind: "stringList",
    },
    {
      id: "completeInventoryEvidence",
      label: "Complete inventory evidence",
      kind: "boolean",
    },
    {
      id: "signedCompleteInventoryMinusAdvertisedCount",
      label: "Signed complete inventory minus advertised count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      componentLabels: value.componentLabels as readonly string[],
      observedJewelCounts: value.observedJewelCounts as readonly number[],
      countEvidenceFlags: value.countEvidenceFlags as readonly number[],
      callerAdvertisedJewelCount: value.callerAdvertisedJewelCount as number,
    }),
});
export const run = tool.execute;
export default tool;
