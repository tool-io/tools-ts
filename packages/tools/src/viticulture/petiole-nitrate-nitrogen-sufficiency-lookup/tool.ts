import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  binary,
  band,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedPetioleNitrateMgKg: readonly number[];
  readonly reportAlreadyAsNitrateNitrogenFlags: readonly number[];
  readonly callerNitrogenAtomicMass: number;
  readonly callerNitrateMolarMass: number;
  readonly callerNitrateNitrogenBandMgKg: readonly number[];
}>;
export type Output = Readonly<{
  readonly nitrateNitrogenEquivalentMgKg: readonly number[];
  readonly petioleSamplesOutsideCallerNitrateNitrogenBand: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPetioleNitrateMgKg",
    label: "Observed petiole nitrate mg kg",
    kind: "numberList",
  },
  {
    id: "reportAlreadyAsNitrateNitrogenFlags",
    label: "Report already as nitrate nitrogen flags",
    kind: "numberList",
  },
  {
    id: "callerNitrogenAtomicMass",
    label: "Caller nitrogen atomic mass",
    kind: "number",
  },
  {
    id: "callerNitrateMolarMass",
    label: "Caller nitrate molar mass",
    kind: "number",
  },
  {
    id: "callerNitrateNitrogenBandMgKg",
    label: "Caller nitrate nitrogen band mg kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerNitrogenAtomicMass, "callerNitrogenAtomicMass");
  positive(input.callerNitrateMolarMass, "callerNitrateMolarMass");
  input.observedPetioleNitrateMgKg.forEach((v) =>
    nonnegative(v, "observedPetioleNitrateMgKg"),
  );
  input.callerNitrateNitrogenBandMgKg.forEach((v) =>
    nonnegative(v, "callerNitrateNitrogenBandMgKg"),
  );
  binary(
    input.reportAlreadyAsNitrateNitrogenFlags,
    "reportAlreadyAsNitrateNitrogenFlags",
  );
  aligned(
    input.observedPetioleNitrateMgKg,
    input.reportAlreadyAsNitrateNitrogenFlags,
    "observedPetioleNitrateMgKg",
  );
  if (
    input.callerNitrogenAtomicMass >= input.callerNitrateMolarMass ||
    input.callerNitrateNitrogenBandMgKg.length !== 2
  )
    simpleError(
      "basis",
      "N atom mass below nitrate molar mass and two same-basis caller limits required.",
    );
  const nitrogen = input.observedPetioleNitrateMgKg.map((v, i) =>
    input.reportAlreadyAsNitrateNitrogenFlags[i]
      ? v
      : v * (input.callerNitrogenAtomicMass / input.callerNitrateMolarMass),
  );
  return {
    nitrateNitrogenEquivalentMgKg: nitrogen,
    petioleSamplesOutsideCallerNitrateNitrogenBand: nitrogen.flatMap((v, i) =>
      band(
        v,
        input.callerNitrateNitrogenBandMgKg[0],
        input.callerNitrateNitrogenBandMgKg[1],
      ) < 0
        ? [i]
        : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPetioleNitrateMgKg: [62, 124, 186],
  reportAlreadyAsNitrateNitrogenFlags: [0, 0, 1],
  callerNitrogenAtomicMass: 14,
  callerNitrateMolarMass: 62,
  callerNitrateNitrogenBandMgKg: [14, 30],
} satisfies Input;
export const exampleOutput = {
  nitrateNitrogenEquivalentMgKg: [14, 28, 186],
  petioleSamplesOutsideCallerNitrateNitrogenBand: [2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/petiole-nitrate-nitrogen-sufficiency-lookup",
  title: "Petiole Nitrate Nitrogen Sufficiency Lookup",
  description:
    "Audit actual petiole nitrate versus nitrate-N report bases with explicit atom/molecule masses and caller stage assay band; already N reports bypass conversion, not total N, fertilizer or universal sufficiency recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "nitrateNitrogenEquivalentMgKg",
      label: "Nitrate nitrogen equivalent mg kg",
      kind: "numberList",
    },
    {
      id: "petioleSamplesOutsideCallerNitrateNitrogenBand",
      label: "Petiole samples outside caller nitrate nitrogen band",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPetioleNitrateMgKg:
        value.observedPetioleNitrateMgKg as readonly number[],
      reportAlreadyAsNitrateNitrogenFlags:
        value.reportAlreadyAsNitrateNitrogenFlags as readonly number[],
      callerNitrogenAtomicMass: value.callerNitrogenAtomicMass as number,
      callerNitrateMolarMass: value.callerNitrateMolarMass as number,
      callerNitrateNitrogenBandMgKg:
        value.callerNitrateNitrogenBandMgKg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
