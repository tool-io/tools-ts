import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, shape } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedLogLocalXyM: readonly (readonly number[])[];
  readonly callerCorridorLineDirectionXy: readonly number[];
  readonly callerCorridorPointXy: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedLateralCorridorDistancesM: readonly number[];
}>;
const inputFields = [
  {
    id: "observedLogLocalXyM",
    label: "Observed log local xy m",
    kind: "matrix",
  },
  {
    id: "callerCorridorLineDirectionXy",
    label: "Caller corridor line direction xy",
    kind: "numberList",
  },
  {
    id: "callerCorridorPointXy",
    label: "Caller corridor point xy",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    shape(input.observedLogLocalXyM, "points") !== 2 ||
    input.callerCorridorLineDirectionXy.length !== 2 ||
    input.callerCorridorPointXy.length !== 2
  )
    simpleError("local", "Explicit local planar points/direction required.");
  const [dx, dy] = input.callerCorridorLineDirectionXy,
    norm = Math.hypot(dx, dy);
  positive(norm, "direction");
  return {
    observedLateralCorridorDistancesM: input.observedLogLocalXyM.map((p) =>
      Math.abs(
        ((p[0] - input.callerCorridorPointXy[0]) * dy) / norm -
          ((p[1] - input.callerCorridorPointXy[1]) * dx) / norm,
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLogLocalXyM: [
    [3, 4],
    [6, 8],
  ],
  callerCorridorLineDirectionXy: [1, 0],
  callerCorridorPointXy: [0, 0],
} satisfies Input;
export const exampleOutput = {
  observedLateralCorridorDistancesM: [4, 8],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/cable-yarder-lateral-yard-distance-corridor",
  title: "Cable Yarder Lateral Yard Distance Calculator",
  description:
    "Measure local log-to-corridor lateral distance from independently resolved planar line, no geodesy, cable deflection, rigging loads or yarding authorization. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedLateralCorridorDistancesM",
      label: "Observed lateral corridor distances m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLogLocalXyM:
        value.observedLogLocalXyM as readonly (readonly number[])[],
      callerCorridorLineDirectionXy:
        value.callerCorridorLineDirectionXy as readonly number[],
      callerCorridorPointXy: value.callerCorridorPointXy as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
