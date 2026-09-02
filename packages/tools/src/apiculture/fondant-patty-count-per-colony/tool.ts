import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedColonyTargetPreparedFondantG: readonly number[];
  readonly independentPattyUsableMassG: number;
}>;
export type Output = Readonly<{
  readonly wholePattyCounts: readonly number[];
  readonly allocationExcessPreparedMassG: readonly number[];
}>;
const inputFields = [
  {
    id: "observedColonyTargetPreparedFondantG",
    label: "Observed colony target prepared fondant g",
    kind: "numberList",
  },
  {
    id: "independentPattyUsableMassG",
    label: "Independent patty usable mass g",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.independentPattyUsableMassG, "independentPattyUsableMassG");
  input.observedColonyTargetPreparedFondantG.forEach((v) =>
    nonnegative(v, "observedColonyTargetPreparedFondantG"),
  );
  const n = input.observedColonyTargetPreparedFondantG.map((v) =>
    integer(Math.ceil(v / input.independentPattyUsableMassG), "patties"),
  );
  return {
    wholePattyCounts: n,
    allocationExcessPreparedMassG: n.map(
      (v, i) =>
        v * input.independentPattyUsableMassG -
        input.observedColonyTargetPreparedFondantG[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedColonyTargetPreparedFondantG: [100, 150],
  independentPattyUsableMassG: 60,
} satisfies Input;
export const exampleOutput = {
  wholePattyCounts: [2, 3],
  allocationExcessPreparedMassG: [20, 30],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/fondant-patty-count-per-colony",
  title: "Fondant Patty Count Per Colony Calculator",
  description:
    "Whole already-prepared fondant patty inventory against caller colony mass targets, excess retained, not a feeding adequacy/dose policy. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    { id: "wholePattyCounts", label: "Whole patty counts", kind: "numberList" },
    {
      id: "allocationExcessPreparedMassG",
      label: "Allocation excess prepared mass g",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedColonyTargetPreparedFondantG:
        value.observedColonyTargetPreparedFondantG as readonly number[],
      independentPattyUsableMassG: value.independentPattyUsableMassG as number,
    }),
});
export const run = tool.execute;
export default tool;
