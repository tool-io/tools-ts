import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualHeadsetUsableEnergyWh: number;
  readonly actualMatchedObservedAveragePowerWatts: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualHeadsetUsableEnergyWh",
    label: "Actual headset usable energy wh",
    kind: "number",
  },
  {
    id: "actualMatchedObservedAveragePowerWatts",
    label: "Actual matched observed average power watts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualHeadsetUsableEnergyWh, "actualHeadsetUsableEnergyWh");
  positive(
    input.actualMatchedObservedAveragePowerWatts,
    "actualMatchedObservedAveragePowerWatts",
  );
  return {
    value:
      input.actualHeadsetUsableEnergyWh /
      input.actualMatchedObservedAveragePowerWatts,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualHeadsetUsableEnergyWh: 10,
    actualMatchedObservedAveragePowerWatts: 2,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/battery-life-headset",
  title: "Headset Battery Life Calculator",
  description:
    "Actual headset matched usable energy/observed average power conditional runtime hours, no nominalmAhvoltagemixing, discharge model forecast.",
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
