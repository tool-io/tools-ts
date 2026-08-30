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
  nonnegative,
  fraction,
  aligned,
  safeCeil,
} from "../shared.js";
export type Input = Readonly<{
  readonly measuredRowLengthsM: readonly number[];
  readonly netDrapeWidthsM: readonly number[];
  readonly callerEndOverlapLengthsM: readonly number[];
  readonly callerSeamWasteFraction: number;
  readonly usableRollAreaM2: number;
}>;
export type Output = Readonly<{
  readonly requiredDrapeNetAreaM2: number;
  readonly totalNetAreaIncludingWasteM2: number;
  readonly wholeNetRollsRequired: number;
}>;
const inputFields = [
  {
    id: "measuredRowLengthsM",
    label: "Measured row lengths m",
    kind: "numberList",
  },
  { id: "netDrapeWidthsM", label: "Net drape widths m", kind: "numberList" },
  {
    id: "callerEndOverlapLengthsM",
    label: "Caller end overlap lengths m",
    kind: "numberList",
  },
  {
    id: "callerSeamWasteFraction",
    label: "Caller seam waste fraction",
    kind: "number",
  },
  { id: "usableRollAreaM2", label: "Usable roll area m2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.usableRollAreaM2, "usableRollAreaM2");
  input.measuredRowLengthsM.forEach((v) =>
    nonnegative(v, "measuredRowLengthsM"),
  );
  input.netDrapeWidthsM.forEach((v) => nonnegative(v, "netDrapeWidthsM"));
  input.callerEndOverlapLengthsM.forEach((v) =>
    nonnegative(v, "callerEndOverlapLengthsM"),
  );
  fraction(input.callerSeamWasteFraction, "callerSeamWasteFraction");
  aligned(
    input.measuredRowLengthsM,
    input.netDrapeWidthsM,
    "measuredRowLengthsM",
  );
  aligned(
    input.measuredRowLengthsM,
    input.callerEndOverlapLengthsM,
    "measuredRowLengthsM",
  );
  if (input.callerSeamWasteFraction === 1)
    simpleError("waste", "Netting waste below one required.");
  const requiredDrapeNetAreaM2 = input.measuredRowLengthsM.reduce(
      (s, l, i) =>
        s +
        (l + 2 * input.callerEndOverlapLengthsM[i]) * input.netDrapeWidthsM[i],
      0,
    ),
    totalNetAreaIncludingWasteM2 =
      requiredDrapeNetAreaM2 / (1 - input.callerSeamWasteFraction);
  return {
    requiredDrapeNetAreaM2,
    totalNetAreaIncludingWasteM2,
    wholeNetRollsRequired: safeCeil(
      totalNetAreaIncludingWasteM2 / input.usableRollAreaM2,
      "rolls",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredRowLengthsM: [100, 200],
  netDrapeWidthsM: [2, 3],
  callerEndOverlapLengthsM: [1, 2],
  callerSeamWasteFraction: 0.1,
  usableRollAreaM2: 100,
} satisfies Input;
export const exampleOutput = {
  requiredDrapeNetAreaM2: 816,
  totalNetAreaIncludingWasteM2: 906.6666666666666,
  wholeNetRollsRequired: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/bird-netting-area-per-hectare",
  title: "Bird Netting Area Per Hectare",
  description:
    "Budget measured variable-width row drapes with independently declared end overlaps, seam waste and usable roll area; no hectares-only area assumption, installation specification or wildlife-exclusion efficacy claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredDrapeNetAreaM2",
      label: "Required drape net area m2",
      kind: "number",
    },
    {
      id: "totalNetAreaIncludingWasteM2",
      label: "Total net area including waste m2",
      kind: "number",
    },
    {
      id: "wholeNetRollsRequired",
      label: "Whole net rolls required",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredRowLengthsM: value.measuredRowLengthsM as readonly number[],
      netDrapeWidthsM: value.netDrapeWidthsM as readonly number[],
      callerEndOverlapLengthsM:
        value.callerEndOverlapLengthsM as readonly number[],
      callerSeamWasteFraction: value.callerSeamWasteFraction as number,
      usableRollAreaM2: value.usableRollAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
