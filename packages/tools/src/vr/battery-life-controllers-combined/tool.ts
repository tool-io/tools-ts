import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  aligned,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIndividualControllerUsableEnergyWh: readonly number[];
  readonly actualIndividualControllerObservedAveragePowerWatts: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndividualControllerUsableEnergyWh",
    label: "Actual individual controller usable energy wh",
    kind: "numberList",
  },
  {
    id: "actualIndividualControllerObservedAveragePowerWatts",
    label: "Actual individual controller observed average power watts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualIndividualControllerUsableEnergyWh.length)
    simpleError(
      "actualIndividualControllerUsableEnergyWh",
      "Actual nonempty observations.",
    );
  input.actualIndividualControllerUsableEnergyWh.forEach((v) =>
    nonnegative(v, "actualIndividualControllerUsableEnergyWh"),
  );
  if (!input.actualIndividualControllerObservedAveragePowerWatts.length)
    simpleError(
      "actualIndividualControllerObservedAveragePowerWatts",
      "Actual nonempty observations.",
    );
  input.actualIndividualControllerObservedAveragePowerWatts.forEach((v) =>
    positive(v, "actualIndividualControllerObservedAveragePowerWatts"),
  );
  aligned(
    input.actualIndividualControllerUsableEnergyWh,
    input.actualIndividualControllerObservedAveragePowerWatts,
    "controllers",
  );
  return {
    value: Math.min(
      ...input.actualIndividualControllerUsableEnergyWh.map(
        (v, i) =>
          v / input.actualIndividualControllerObservedAveragePowerWatts[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndividualControllerUsableEnergyWh: [10, 20],
    actualIndividualControllerObservedAveragePowerWatts: [2, 2],
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/battery-life-controllers-combined",
  title: "Combined Controllers Battery Life Calculator",
  description:
    "Simultaneous controller-pair/array up time until FIRST depleted=minindividualWh/W, not inappropriate combined energy/combined power average.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
