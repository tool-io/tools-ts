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
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly panelDropLengthsM: readonly number[];
  readonly usableRollLengthM: number;
  readonly callerKerfBetweenCutsM: number;
}>;
export type Output = Readonly<{
  readonly requiredSequentialRollCount: number;
  readonly assignedRollNumbers: readonly number[];
  readonly unusedRollLengthsM: readonly number[];
}>;
const inputFields = [
  {
    id: "panelDropLengthsM",
    label: "Panel drop lengths m",
    kind: "numberList",
  },
  { id: "usableRollLengthM", label: "Usable roll length m", kind: "number" },
  {
    id: "callerKerfBetweenCutsM",
    label: "Caller kerf between cuts m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.panelDropLengthsM.forEach((v) => positive(v, "panelDropLengthsM"));
  positive(input.usableRollLengthM, "usableRollLengthM");
  nonnegative(input.callerKerfBetweenCutsM, "callerKerfBetweenCutsM");
  if (
    !input.panelDropLengthsM.length ||
    input.panelDropLengthsM.length > 128 ||
    input.panelDropLengthsM.some((v) => v > input.usableRollLengthM)
  )
    simpleError(
      "cuts",
      "1–128 drop cuts each within one usable roll required.",
    );
  const remaining: number[] = [input.usableRollLengthM],
    assigned: number[] = [];
  let roll = 0;
  input.panelDropLengthsM.forEach((v) => {
    const gap =
      remaining[roll] === input.usableRollLengthM
        ? 0
        : input.callerKerfBetweenCutsM;
    if (v + gap > remaining[roll]) {
      roll++;
      remaining.push(input.usableRollLengthM);
    } else remaining[roll] -= gap;
    remaining[roll] -= v;
    assigned.push(roll);
  });
  return {
    requiredSequentialRollCount: remaining.length,
    assignedRollNumbers: assigned,
    unusedRollLengthsM: remaining,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  panelDropLengthsM: [3, 4, 2],
  usableRollLengthM: 5,
  callerKerfBetweenCutsM: 0,
} satisfies Input;
export const exampleOutput = {
  requiredSequentialRollCount: 3,
  assignedRollNumbers: [0, 1, 2],
  unusedRollLengthsM: [2, 1, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/poly-film-roll-needed",
  title: "Poly Film Roll Needed Calculator",
  description:
    "Plan actual fixed-order film-drop cutting using next-fit roll packing and explicit between-cut kerf; not an optimal bin-packing claim, area-only purchasing or fabric-width compatibility.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredSequentialRollCount",
      label: "Required sequential roll count",
      kind: "number",
    },
    {
      id: "assignedRollNumbers",
      label: "Assigned roll numbers",
      kind: "numberList",
    },
    {
      id: "unusedRollLengthsM",
      label: "Unused roll lengths m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      panelDropLengthsM: value.panelDropLengthsM as readonly number[],
      usableRollLengthM: value.usableRollLengthM as number,
      callerKerfBetweenCutsM: value.callerKerfBetweenCutsM as number,
    }),
});
export const run = tool.execute;
export default tool;
