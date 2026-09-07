import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedGeWellHallHoleSheetPerM2: readonly number[];
  readonly observedGeWellSheetOhms: readonly number[];
  readonly callerElementaryChargeC: number;
}>;
export type Output = Readonly<{
  readonly extractedHallHoleMobilitiesM2VoltSecond: readonly number[];
}>;
const inputFields = [
  {
    id: "observedGeWellHallHoleSheetPerM2",
    label: "Observed ge well hall hole sheet per m2",
    kind: "numberList",
  },
  {
    id: "observedGeWellSheetOhms",
    label: "Observed ge well sheet ohms",
    kind: "numberList",
  },
  {
    id: "callerElementaryChargeC",
    label: "Caller elementary charge c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedGeWellHallHoleSheetPerM2.forEach((v) =>
    positive(v, "observedGeWellHallHoleSheetPerM2"),
  );
  input.observedGeWellSheetOhms.forEach((v) =>
    positive(v, "observedGeWellSheetOhms"),
  );
  positive(input.callerElementaryChargeC, "callerElementaryChargeC");
  aligned(
    input.observedGeWellHallHoleSheetPerM2,
    input.observedGeWellSheetOhms,
    "observedGeWellHallHoleSheetPerM2",
  );
  return {
    extractedHallHoleMobilitiesM2VoltSecond:
      input.observedGeWellHallHoleSheetPerM2.map(
        (v, i) =>
          1 /
          input.callerElementaryChargeC /
          v /
          input.observedGeWellSheetOhms[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGeWellHallHoleSheetPerM2: [1e16, 2e16],
  observedGeWellSheetOhms: [100, 200],
  callerElementaryChargeC: 1.6e-19,
} satisfies Input;
export const exampleOutput = {
  extractedHallHoleMobilitiesM2VoltSecond: [6.25, 1.5625],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/ge-quantum-well-hole-mobility",
  title: "Semiconductor Ge Quantum Well Hole Mobility Calculator",
  description:
    "Extract actual Ge-well Hall-hole mobility from paired independent sheet measurements, caller resolves Hall factor/multiple bands; not silicon doping mobility or electron 2DEG model.",
  inputs: inputFields,
  outputs: [
    {
      id: "extractedHallHoleMobilitiesM2VoltSecond",
      label: "Extracted hall hole mobilities m2 volt second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGeWellHallHoleSheetPerM2:
        value.observedGeWellHallHoleSheetPerM2 as readonly number[],
      observedGeWellSheetOhms:
        value.observedGeWellSheetOhms as readonly number[],
      callerElementaryChargeC: value.callerElementaryChargeC as number,
    }),
});
export const run = tool.execute;
export default tool;
