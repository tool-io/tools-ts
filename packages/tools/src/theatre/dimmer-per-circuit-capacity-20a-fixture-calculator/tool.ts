import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
  aligned,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly fixtureMeasuredCurrentArms: readonly number[];
  readonly assignedCircuitNumbers: readonly number[];
  readonly callerCircuitUsableCurrentLimitsA: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedLoadsByCircuitA: readonly number[];
  readonly signedCircuitCurrentMarginsA: readonly number[];
  readonly overCallerCircuitBudgetIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "fixtureMeasuredCurrentArms",
    label: "Fixture measured current arms",
    kind: "numberList",
  },
  {
    id: "assignedCircuitNumbers",
    label: "Assigned circuit numbers",
    kind: "numberList",
  },
  {
    id: "callerCircuitUsableCurrentLimitsA",
    label: "Caller circuit usable current limits a",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.fixtureMeasuredCurrentArms.forEach((v) =>
    nonnegative(v, "fixtureMeasuredCurrentArms"),
  );
  input.callerCircuitUsableCurrentLimitsA.forEach((v) =>
    nonnegative(v, "callerCircuitUsableCurrentLimitsA"),
  );
  aligned(
    input.fixtureMeasuredCurrentArms,
    input.assignedCircuitNumbers,
    "fixtureMeasuredCurrentArms",
  );
  if (
    !input.callerCircuitUsableCurrentLimitsA.length ||
    input.callerCircuitUsableCurrentLimitsA.length > 128
  )
    simpleError(
      "circuits",
      "1–128 explicit usable circuit current budgets required.",
    );
  const loads = Array<number>(
    input.callerCircuitUsableCurrentLimitsA.length,
  ).fill(0);
  input.assignedCircuitNumbers.forEach((c, i) => {
    bounded(c, "circuit", 0, loads.length - 1);
    loads[c] += input.fixtureMeasuredCurrentArms[i];
  });
  return {
    observedLoadsByCircuitA: loads,
    signedCircuitCurrentMarginsA: loads.map(
      (v, i) => input.callerCircuitUsableCurrentLimitsA[i] - v,
    ),
    overCallerCircuitBudgetIndices: loads.flatMap((v, i) =>
      v > input.callerCircuitUsableCurrentLimitsA[i] ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fixtureMeasuredCurrentArms: [3, 4, 5],
  assignedCircuitNumbers: [0, 0, 1],
  callerCircuitUsableCurrentLimitsA: [6, 10],
} satisfies Input;
export const exampleOutput = {
  observedLoadsByCircuitA: [7, 5],
  signedCircuitCurrentMarginsA: [-1, 5],
  overCallerCircuitBudgetIndices: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/dimmer-per-circuit-capacity-20a-fixture-calculator",
  title: "Dimmer Per Circuit Capacity 20A Fixture Calculator",
  description:
    "Reconcile actual fixture patch/RMS-current ledger by caller circuit usable budgets, not assuming every circuit is 20A, certified derating, inrush or electrical installation clearance.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedLoadsByCircuitA",
      label: "Observed loads by circuit a",
      kind: "numberList",
    },
    {
      id: "signedCircuitCurrentMarginsA",
      label: "Signed circuit current margins a",
      kind: "numberList",
    },
    {
      id: "overCallerCircuitBudgetIndices",
      label: "Over caller circuit budget indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      fixtureMeasuredCurrentArms:
        value.fixtureMeasuredCurrentArms as readonly number[],
      assignedCircuitNumbers: value.assignedCircuitNumbers as readonly number[],
      callerCircuitUsableCurrentLimitsA:
        value.callerCircuitUsableCurrentLimitsA as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
