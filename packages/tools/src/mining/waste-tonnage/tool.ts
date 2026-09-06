import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  binary,
  inventory,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedWasteBankVolumesM3: readonly number[];
  readonly observedMatchedDryBulkTonnesM3: readonly number[];
  readonly knownWasteVolumeFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownWasteDryTonnes: number;
  readonly unassessedWasteBlockCount: number;
}>;
const inputFields = [
  {
    id: "observedWasteBankVolumesM3",
    label: "Observed waste bank volumes m3",
    kind: "numberList",
  },
  {
    id: "observedMatchedDryBulkTonnesM3",
    label: "Observed matched dry bulk tonnes m3",
    kind: "numberList",
  },
  {
    id: "knownWasteVolumeFlags",
    label: "Known waste volume flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedDryBulkTonnesM3.forEach((v) =>
    positive(v, "observedMatchedDryBulkTonnesM3"),
  );
  input.observedWasteBankVolumesM3.forEach((v) =>
    nonnegative(v, "observedWasteBankVolumesM3"),
  );
  binary(input.knownWasteVolumeFlags, "knownWasteVolumeFlags");
  aligned(
    input.observedWasteBankVolumesM3,
    input.observedMatchedDryBulkTonnesM3,
    "observedWasteBankVolumesM3",
  );
  aligned(
    input.observedWasteBankVolumesM3,
    input.knownWasteVolumeFlags,
    "observedWasteBankVolumesM3",
  );
  const v = inventory(
    input.observedWasteBankVolumesM3.map(
      (v, i) => v * input.observedMatchedDryBulkTonnesM3[i],
    ),
    input.knownWasteVolumeFlags,
  );
  return {
    knownWasteDryTonnes: v.knownTotal,
    unassessedWasteBlockCount: v.unassessedCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWasteBankVolumesM3: [10, 20],
  observedMatchedDryBulkTonnesM3: [2, 3],
  knownWasteVolumeFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  knownWasteDryTonnes: 20,
  unassessedWasteBlockCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/waste-tonnage",
  title: "Waste Tonnage Calculator",
  description:
    "Audit independently classified actual waste bank volumes/dry densities with unknown survey blocks, not ore-fraction block tonnage or loose swell assumption. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownWasteDryTonnes",
      label: "Known waste dry tonnes",
      kind: "number",
    },
    {
      id: "unassessedWasteBlockCount",
      label: "Unassessed waste block count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWasteBankVolumesM3:
        value.observedWasteBankVolumesM3 as readonly number[],
      observedMatchedDryBulkTonnesM3:
        value.observedMatchedDryBulkTonnesM3 as readonly number[],
      knownWasteVolumeFlags: value.knownWasteVolumeFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
