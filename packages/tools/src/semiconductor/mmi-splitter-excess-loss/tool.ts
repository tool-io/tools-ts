import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualOutputPortPowersWatts: readonly number[];
  readonly matchedIncidentPowerWatts: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualOutputPortPowersWatts",
    label: "Actual output port powers watts",
    kind: "numberList",
  },
  {
    id: "matchedIncidentPowerWatts",
    label: "Matched incident power watts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.matchedIncidentPowerWatts, "input-power");
  input.actualOutputPortPowersWatts.forEach((v) =>
    nonnegative(v, "port-power"),
  );
  return {
    signedObservedMmiExcessLossDb:
      10 *
      Math.log10(
        input.matchedIncidentPowerWatts /
          positive(sum(input.actualOutputPortPowersWatts), "observed-output"),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualOutputPortPowersWatts: [2, 3], matchedIncidentPowerWatts: 10 },
  output: { result: { signedObservedMmiExcessLossDb: 3.010299956639812 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/mmi-splitter-excess-loss",
  title: "Semiconductor Mmi Splitter Excess Loss Calculator",
  description:
    "Actual MMIexcess loss referenced to sum of all independently measured output ports, not one-port insertion loss or theoretical splitter division. Incomplete ports/measurement mismatch external; signed apparent gain retained.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
