import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
  safeCeil,
} from "../shared.js";
export type Input = Readonly<{
  readonly galleryAreasM2: readonly number[];
  readonly callerM2PerTrap: readonly number[];
  readonly existingWorkingTrapCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerTargetTrapCounts: readonly number[];
  readonly additionalTrapDeficits: readonly number[];
  readonly existingTrapExcesses: readonly number[];
}>;
const inputFields = [
  { id: "galleryAreasM2", label: "Gallery areas m2", kind: "numberList" },
  { id: "callerM2PerTrap", label: "Caller m2 per trap", kind: "numberList" },
  {
    id: "existingWorkingTrapCounts",
    label: "Existing working trap counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerM2PerTrap.forEach((v) => positive(v, "callerM2PerTrap"));
  input.galleryAreasM2.forEach((v) => nonnegative(v, "galleryAreasM2"));
  input.existingWorkingTrapCounts.forEach((v) =>
    count(v, "existingWorkingTrapCounts"),
  );
  aligned(input.galleryAreasM2, input.callerM2PerTrap, "galleryAreasM2");
  aligned(
    input.galleryAreasM2,
    input.existingWorkingTrapCounts,
    "galleryAreasM2",
  );
  const n = input.galleryAreasM2.map((v, i) =>
    safeCeil(v / input.callerM2PerTrap[i], "traps"),
  );
  return {
    callerTargetTrapCounts: n,
    additionalTrapDeficits: n.map((v, i) =>
      Math.max(0, v - input.existingWorkingTrapCounts[i]),
    ),
    existingTrapExcesses: n.map((v, i) =>
      Math.max(0, input.existingWorkingTrapCounts[i] - v),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  galleryAreasM2: [100, 200],
  callerM2PerTrap: [40, 100],
  existingWorkingTrapCounts: [2, 3],
} satisfies Input;
export const exampleOutput = {
  callerTargetTrapCounts: [3, 2],
  additionalTrapDeficits: [1, 0],
  existingTrapExcesses: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/insect-trap-density-planner",
  title: "Insect Flight Trap Density per Gallery Area Planner",
  description:
    "Budget whole monitoring traps by measured galleries and caller density policy with local existing deficits/excesses; not guaranteed insect detection or a recommended trap grid.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerTargetTrapCounts",
      label: "Caller target trap counts",
      kind: "numberList",
    },
    {
      id: "additionalTrapDeficits",
      label: "Additional trap deficits",
      kind: "numberList",
    },
    {
      id: "existingTrapExcesses",
      label: "Existing trap excesses",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      galleryAreasM2: value.galleryAreasM2 as readonly number[],
      callerM2PerTrap: value.callerM2PerTrap as readonly number[],
      existingWorkingTrapCounts:
        value.existingWorkingTrapCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
