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
  aligned,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly measuredNewPotFilledLiters: readonly number[];
  readonly measuredDisplacingExistingRootballLiters: readonly number[];
  readonly callerAdditionalSettlingAllowanceFraction: number;
  readonly availableNewMediaLiters: number;
}>;
export type Output = Readonly<{
  readonly netAdditionalMediaLitersByPot: readonly number[];
  readonly totalAdditionalMediaLiters: number;
  readonly signedNewMediaInventoryMarginLiters: number;
}>;
const inputFields = [
  {
    id: "measuredNewPotFilledLiters",
    label: "Measured new pot filled liters",
    kind: "numberList",
  },
  {
    id: "measuredDisplacingExistingRootballLiters",
    label: "Measured displacing existing rootball liters",
    kind: "numberList",
  },
  {
    id: "callerAdditionalSettlingAllowanceFraction",
    label: "Caller additional settling allowance fraction",
    kind: "number",
  },
  {
    id: "availableNewMediaLiters",
    label: "Available new media liters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredNewPotFilledLiters.forEach((v) =>
    nonnegative(v, "measuredNewPotFilledLiters"),
  );
  input.measuredDisplacingExistingRootballLiters.forEach((v) =>
    nonnegative(v, "measuredDisplacingExistingRootballLiters"),
  );
  nonnegative(
    input.callerAdditionalSettlingAllowanceFraction,
    "callerAdditionalSettlingAllowanceFraction",
  );
  nonnegative(input.availableNewMediaLiters, "availableNewMediaLiters");
  aligned(
    input.measuredNewPotFilledLiters,
    input.measuredDisplacingExistingRootballLiters,
    "measuredNewPotFilledLiters",
  );
  if (
    input.measuredDisplacingExistingRootballLiters.some(
      (v, i) => v > input.measuredNewPotFilledLiters[i],
    )
  )
    simpleError(
      "rootball",
      "Rootball displacement exceeds planned filled interior.",
    );
  const additional = input.measuredNewPotFilledLiters.map(
      (v, i) =>
        (v - input.measuredDisplacingExistingRootballLiters[i]) *
        (1 + input.callerAdditionalSettlingAllowanceFraction),
    ),
    total = sum(additional);
  return {
    netAdditionalMediaLitersByPot: additional,
    totalAdditionalMediaLiters: total,
    signedNewMediaInventoryMarginLiters: input.availableNewMediaLiters - total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredNewPotFilledLiters: [3, 5],
  measuredDisplacingExistingRootballLiters: [1, 2],
  callerAdditionalSettlingAllowanceFraction: 0.1,
  availableNewMediaLiters: 5,
} satisfies Input;
export const exampleOutput = {
  netAdditionalMediaLitersByPot: [2.2, 3.3],
  totalAdditionalMediaLiters: 5.5,
  signedNewMediaInventoryMarginLiters: -0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/repot-soil-volume-increase",
  title: "Repot Soil Volume Increase Calculator",
  description:
    "Reconcile actual repot fill/rootball displacement, caller extra settling allowance and media inventory; not simple old/new nominal pot volume percentage or blend-calibration equivalence.",
  inputs: inputFields,
  outputs: [
    {
      id: "netAdditionalMediaLitersByPot",
      label: "Net additional media liters by pot",
      kind: "numberList",
    },
    {
      id: "totalAdditionalMediaLiters",
      label: "Total additional media liters",
      kind: "number",
    },
    {
      id: "signedNewMediaInventoryMarginLiters",
      label: "Signed new media inventory margin liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredNewPotFilledLiters:
        value.measuredNewPotFilledLiters as readonly number[],
      measuredDisplacingExistingRootballLiters:
        value.measuredDisplacingExistingRootballLiters as readonly number[],
      callerAdditionalSettlingAllowanceFraction:
        value.callerAdditionalSettlingAllowanceFraction as number,
      availableNewMediaLiters: value.availableNewMediaLiters as number,
    }),
});
export const run = tool.execute;
export default tool;
