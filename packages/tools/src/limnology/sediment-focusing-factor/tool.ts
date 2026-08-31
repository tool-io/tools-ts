import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedCoreInventoryBqM2: number;
  readonly callerExpectedAtmosphericInventoryBqM2: number;
}>;
export type Output = Readonly<{
  readonly apparentSedimentFocusingFactor: number;
}>;
const inputFields = [
  {
    id: "observedCoreInventoryBqM2",
    label: "Observed core inventory bq m2",
    kind: "number",
  },
  {
    id: "callerExpectedAtmosphericInventoryBqM2",
    label: "Caller expected atmospheric inventory bq m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerExpectedAtmosphericInventoryBqM2,
    "callerExpectedAtmosphericInventoryBqM2",
  );
  nonnegative(input.observedCoreInventoryBqM2, "observedCoreInventoryBqM2");
  return {
    apparentSedimentFocusingFactor:
      input.observedCoreInventoryBqM2 /
      input.callerExpectedAtmosphericInventoryBqM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCoreInventoryBqM2: 200,
  callerExpectedAtmosphericInventoryBqM2: 100,
} satisfies Input;
export const exampleOutput = {
  apparentSedimentFocusingFactor: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/sediment-focusing-factor",
  title: "Sediment Focusing Factor Calculator",
  description:
    "Compare complete core inventory with explicit independently justified atmospheric reference to apparent sediment focusing; not corrected Pb210 chronology or proof deposition difference is solely focusing.",
  inputs: inputFields,
  outputs: [
    {
      id: "apparentSedimentFocusingFactor",
      label: "Apparent sediment focusing factor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCoreInventoryBqM2: value.observedCoreInventoryBqM2 as number,
      callerExpectedAtmosphericInventoryBqM2:
        value.callerExpectedAtmosphericInventoryBqM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
