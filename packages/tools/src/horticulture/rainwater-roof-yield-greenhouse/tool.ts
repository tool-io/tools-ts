import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedRainMmByEvent: readonly number[];
  readonly measuredRoofPlanAreaM2: number;
  readonly callerRunoffCaptureFractions: readonly number[];
  readonly firstFlushLitersByEvent: readonly number[];
  readonly freeStorageLiters: number;
}>;
export type Output = Readonly<{
  readonly netCollectedRainwaterLitersByEvent: readonly number[];
  readonly capturedIntoStorageLiters: number;
  readonly overflowRainwaterLiters: number;
}>;
const inputFields = [
  {
    id: "observedRainMmByEvent",
    label: "Observed rain mm by event",
    kind: "numberList",
  },
  {
    id: "measuredRoofPlanAreaM2",
    label: "Measured roof plan area m2",
    kind: "number",
  },
  {
    id: "callerRunoffCaptureFractions",
    label: "Caller runoff capture fractions",
    kind: "numberList",
  },
  {
    id: "firstFlushLitersByEvent",
    label: "First flush liters by event",
    kind: "numberList",
  },
  { id: "freeStorageLiters", label: "Free storage liters", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRainMmByEvent.forEach((v) =>
    nonnegative(v, "observedRainMmByEvent"),
  );
  nonnegative(input.measuredRoofPlanAreaM2, "measuredRoofPlanAreaM2");
  input.firstFlushLitersByEvent.forEach((v) =>
    nonnegative(v, "firstFlushLitersByEvent"),
  );
  nonnegative(input.freeStorageLiters, "freeStorageLiters");
  input.callerRunoffCaptureFractions.forEach((v) =>
    fraction(v, "callerRunoffCaptureFractions"),
  );
  aligned(
    input.observedRainMmByEvent,
    input.callerRunoffCaptureFractions,
    "observedRainMmByEvent",
  );
  aligned(
    input.observedRainMmByEvent,
    input.firstFlushLitersByEvent,
    "observedRainMmByEvent",
  );
  const collected = input.observedRainMmByEvent.map((v, i) =>
      Math.max(
        0,
        v *
          input.measuredRoofPlanAreaM2 *
          input.callerRunoffCaptureFractions[i] -
          input.firstFlushLitersByEvent[i],
      ),
    ),
    total = sum(collected);
  return {
    netCollectedRainwaterLitersByEvent: collected,
    capturedIntoStorageLiters: Math.min(total, input.freeStorageLiters),
    overflowRainwaterLiters: Math.max(0, total - input.freeStorageLiters),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRainMmByEvent: [10, 20],
  measuredRoofPlanAreaM2: 100,
  callerRunoffCaptureFractions: [0.8, 0.5],
  firstFlushLitersByEvent: [100, 0],
  freeStorageLiters: 1000,
} satisfies Input;
export const exampleOutput = {
  netCollectedRainwaterLitersByEvent: [700, 1000],
  capturedIntoStorageLiters: 1000,
  overflowRainwaterLiters: 700,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/rainwater-roof-yield-greenhouse",
  title: "Rainwater Roof Yield Greenhouse Calculator",
  description:
    "Reconcile actual greenhouse roof rain events with event capture/first flush and no-between-event storage withdrawal; plan area not roof slope surface, no potable-water quality or future rainfall guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "netCollectedRainwaterLitersByEvent",
      label: "Net collected rainwater liters by event",
      kind: "numberList",
    },
    {
      id: "capturedIntoStorageLiters",
      label: "Captured into storage liters",
      kind: "number",
    },
    {
      id: "overflowRainwaterLiters",
      label: "Overflow rainwater liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRainMmByEvent: value.observedRainMmByEvent as readonly number[],
      measuredRoofPlanAreaM2: value.measuredRoofPlanAreaM2 as number,
      callerRunoffCaptureFractions:
        value.callerRunoffCaptureFractions as readonly number[],
      firstFlushLitersByEvent:
        value.firstFlushLitersByEvent as readonly number[],
      freeStorageLiters: value.freeStorageLiters as number,
    }),
});
export const run = tool.execute;
export default tool;
