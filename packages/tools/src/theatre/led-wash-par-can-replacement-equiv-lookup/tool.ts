import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  positive,
  nonnegative,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly referenceMeasuredLuxOnMatchedArea: number;
  readonly observedLedLuxPerFixtureOnSameArea: number;
  readonly referenceFixturePowerW: number;
  readonly observedLedFixturePowerW: number;
}>;
export type Output = Readonly<{
  readonly minimumWholeLedFixturesForMatchedLux: number;
  readonly modeledMatchedLuxWithWholeFixtures: number;
  readonly signedFixturePowerReductionW: number;
}>;
const inputFields = [
  {
    id: "referenceMeasuredLuxOnMatchedArea",
    label: "Reference measured lux on matched area",
    kind: "number",
  },
  {
    id: "observedLedLuxPerFixtureOnSameArea",
    label: "Observed led lux per fixture on same area",
    kind: "number",
  },
  {
    id: "referenceFixturePowerW",
    label: "Reference fixture power w",
    kind: "number",
  },
  {
    id: "observedLedFixturePowerW",
    label: "Observed led fixture power w",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedLedLuxPerFixtureOnSameArea,
    "observedLedLuxPerFixtureOnSameArea",
  );
  nonnegative(
    input.referenceMeasuredLuxOnMatchedArea,
    "referenceMeasuredLuxOnMatchedArea",
  );
  nonnegative(input.referenceFixturePowerW, "referenceFixturePowerW");
  nonnegative(input.observedLedFixturePowerW, "observedLedFixturePowerW");
  const count = integer(
    Math.ceil(
      input.referenceMeasuredLuxOnMatchedArea /
        input.observedLedLuxPerFixtureOnSameArea,
    ),
    "fixtures",
  );
  return {
    minimumWholeLedFixturesForMatchedLux: count,
    modeledMatchedLuxWithWholeFixtures:
      count * input.observedLedLuxPerFixtureOnSameArea,
    signedFixturePowerReductionW:
      input.referenceFixturePowerW - count * input.observedLedFixturePowerW,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceMeasuredLuxOnMatchedArea: 1000,
  observedLedLuxPerFixtureOnSameArea: 400,
  referenceFixturePowerW: 500,
  observedLedFixturePowerW: 100,
} satisfies Input;
export const exampleOutput = {
  minimumWholeLedFixturesForMatchedLux: 3,
  modeledMatchedLuxWithWholeFixtures: 1200,
  signedFixturePowerReductionW: 200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/led-wash-par-can-replacement-equiv-lookup",
  title: "LED Wash Par Can Replacement Equiv Lookup",
  description:
    "Compare measured LED/PAR matched-area illuminance with whole fixture counts and actual power; assumes additive matched coverage, not wattage-only equivalence, spectral rendering, dimming or physical fixture compatibility.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumWholeLedFixturesForMatchedLux",
      label: "Minimum whole led fixtures for matched lux",
      kind: "number",
    },
    {
      id: "modeledMatchedLuxWithWholeFixtures",
      label: "Modeled matched lux with whole fixtures",
      kind: "number",
    },
    {
      id: "signedFixturePowerReductionW",
      label: "Signed fixture power reduction w",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceMeasuredLuxOnMatchedArea:
        value.referenceMeasuredLuxOnMatchedArea as number,
      observedLedLuxPerFixtureOnSameArea:
        value.observedLedLuxPerFixtureOnSameArea as number,
      referenceFixturePowerW: value.referenceFixturePowerW as number,
      observedLedFixturePowerW: value.observedLedFixturePowerW as number,
    }),
});
export const run = tool.execute;
export default tool;
