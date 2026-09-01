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
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedSteamOutputKgHour: number;
  readonly observedFeedTdsMgKg: number;
  readonly callerMaximumBoilerTdsMgKg: number;
}>;
export type Output = Readonly<{
  readonly modeledContinuousBlowdownKgHour: number;
  readonly modeledGrossFeedwaterKgHour: number;
}>;
const inputFields = [
  {
    id: "observedSteamOutputKgHour",
    label: "Observed steam output kg hour",
    kind: "number",
  },
  {
    id: "observedFeedTdsMgKg",
    label: "Observed feed tds mg kg",
    kind: "number",
  },
  {
    id: "callerMaximumBoilerTdsMgKg",
    label: "Caller maximum boiler tds mg kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerMaximumBoilerTdsMgKg, "callerMaximumBoilerTdsMgKg");
  nonnegative(input.observedSteamOutputKgHour, "observedSteamOutputKgHour");
  nonnegative(input.observedFeedTdsMgKg, "observedFeedTdsMgKg");
  if (input.callerMaximumBoilerTdsMgKg <= input.observedFeedTdsMgKg)
    simpleError(
      "solids",
      "Caller boiler solids limit must exceed actual feed solids.",
    );
  const blow =
    (input.observedSteamOutputKgHour * input.observedFeedTdsMgKg) /
    (input.callerMaximumBoilerTdsMgKg - input.observedFeedTdsMgKg);
  return {
    modeledContinuousBlowdownKgHour: blow,
    modeledGrossFeedwaterKgHour: input.observedSteamOutputKgHour + blow,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSteamOutputKgHour: 100,
  observedFeedTdsMgKg: 10,
  callerMaximumBoilerTdsMgKg: 100,
} satisfies Input;
export const exampleOutput = {
  modeledContinuousBlowdownKgHour: 11.11111111111111,
  modeledGrossFeedwaterKgHour: 111.11111111111111,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/steam-boiler-blowdown-rate",
  title: "Plumbing Steam Boiler Blowdown Rate Calculator",
  description:
    "Solve ideal steady dissolved-solids steam/feed/blowdown balance assuming no steam solids, explicit caller maximum; not a boiler-control procedure or chemistry/pressure approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledContinuousBlowdownKgHour",
      label: "Modeled continuous blowdown kg hour",
      kind: "number",
    },
    {
      id: "modeledGrossFeedwaterKgHour",
      label: "Modeled gross feedwater kg hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSteamOutputKgHour: value.observedSteamOutputKgHour as number,
      observedFeedTdsMgKg: value.observedFeedTdsMgKg as number,
      callerMaximumBoilerTdsMgKg: value.callerMaximumBoilerTdsMgKg as number,
    }),
});
export const run = tool.execute;
export default tool;
