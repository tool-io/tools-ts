import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sum,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerLotIds: readonly string[];
  readonly observedSherdGrossMassesG: readonly number[];
  readonly independentlyMeasuredLotTaresG: readonly number[];
}>;
export type Output = Readonly<{
  readonly distinctLotIds: readonly string[];
  readonly netSherdMassPerLotG: readonly number[];
  readonly totalNetSherdMassG: number;
}>;
const inputFields = [
  { id: "callerLotIds", label: "Caller lot ids", kind: "stringList" },
  {
    id: "observedSherdGrossMassesG",
    label: "Observed sherd gross masses g",
    kind: "numberList",
  },
  {
    id: "independentlyMeasuredLotTaresG",
    label: "Independently measured lot tares g",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSherdGrossMassesG.forEach((v) =>
    nonnegative(v, "observedSherdGrossMassesG"),
  );
  input.independentlyMeasuredLotTaresG.forEach((v) =>
    nonnegative(v, "independentlyMeasuredLotTaresG"),
  );
  aligned(input.callerLotIds, input.observedSherdGrossMassesG, "callerLotIds");
  aligned(
    input.callerLotIds,
    input.independentlyMeasuredLotTaresG,
    "callerLotIds",
  );
  const ids = [...new Set(input.callerLotIds)],
    net = input.observedSherdGrossMassesG.map((v, i) =>
      nonnegative(v - input.independentlyMeasuredLotTaresG[i], "net sample"),
    );
  return {
    distinctLotIds: ids,
    netSherdMassPerLotG: ids.map((id) =>
      sum(net.filter((_, i) => input.callerLotIds[i] === id)),
    ),
    totalNetSherdMassG: sum(net),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerLotIds: ["a", "b", "a"],
  observedSherdGrossMassesG: [10, 20, 30],
  independentlyMeasuredLotTaresG: [1, 2, 3],
} satisfies Input;
export const exampleOutput = {
  distinctLotIds: ["a", "b"],
  netSherdMassPerLotG: [36, 18],
  totalNetSherdMassG: 54,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/sherd-weight-total-per-lot",
  title: "Sherd Weight Total Per Lot Calculator",
  description:
    "Actual tare-corrected sherd weight grouped by exact lot ID, no estimated vessel count or generic inventory record replication. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
  inputs: inputFields,
  outputs: [
    { id: "distinctLotIds", label: "Distinct lot ids", kind: "stringList" },
    {
      id: "netSherdMassPerLotG",
      label: "Net sherd mass per lot g",
      kind: "numberList",
    },
    {
      id: "totalNetSherdMassG",
      label: "Total net sherd mass g",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerLotIds: value.callerLotIds as readonly string[],
      observedSherdGrossMassesG:
        value.observedSherdGrossMassesG as readonly number[],
      independentlyMeasuredLotTaresG:
        value.independentlyMeasuredLotTaresG as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
