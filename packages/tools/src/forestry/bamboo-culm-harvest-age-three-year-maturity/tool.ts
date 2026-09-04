import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  binary,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedBambooEmergenceYears: readonly number[];
  readonly asOfYear: number;
  readonly callerMinimumMaturityYears: number;
  readonly callerKnownCulmAgeFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownMatureCulmIndices: readonly number[];
  readonly unknownCulmAgeIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedBambooEmergenceYears",
    label: "Observed bamboo emergence years",
    kind: "numberList",
  },
  { id: "asOfYear", label: "As of year", kind: "number" },
  {
    id: "callerMinimumMaturityYears",
    label: "Caller minimum maturity years",
    kind: "number",
  },
  {
    id: "callerKnownCulmAgeFlags",
    label: "Caller known culm age flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.asOfYear, "year", 1900, 2199);
  bounded(input.callerMinimumMaturityYears, "age", 1, 100);
  aligned(
    input.observedBambooEmergenceYears,
    input.callerKnownCulmAgeFlags,
    "culms",
  );
  binary(input.callerKnownCulmAgeFlags, "known");
  input.observedBambooEmergenceYears.forEach((v) =>
    bounded(v, "year", 1900, input.asOfYear),
  );
  return {
    knownMatureCulmIndices: input.observedBambooEmergenceYears.flatMap(
      (v, i) =>
        input.callerKnownCulmAgeFlags[i] &&
        input.asOfYear - v >= input.callerMinimumMaturityYears
          ? [i]
          : [],
    ),
    unknownCulmAgeIndices: input.callerKnownCulmAgeFlags.flatMap((v, i) =>
      !v ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBambooEmergenceYears: [2018, 2020],
  asOfYear: 2021,
  callerMinimumMaturityYears: 3,
  callerKnownCulmAgeFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  knownMatureCulmIndices: [0],
  unknownCulmAgeIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/bamboo-culm-harvest-age-three-year-maturity",
  title: "Bamboo Culm Three-Year Maturity Harvest Age",
  description:
    "Audit independently dated bamboo culms against caller maturity interval (three-year example), unknown ages retained, no harvest or structural readiness. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownMatureCulmIndices",
      label: "Known mature culm indices",
      kind: "numberList",
    },
    {
      id: "unknownCulmAgeIndices",
      label: "Unknown culm age indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBambooEmergenceYears:
        value.observedBambooEmergenceYears as readonly number[],
      asOfYear: value.asOfYear as number,
      callerMinimumMaturityYears: value.callerMinimumMaturityYears as number,
      callerKnownCulmAgeFlags:
        value.callerKnownCulmAgeFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
