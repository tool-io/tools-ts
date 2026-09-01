import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly raceDistanceMeters: number;
  readonly raceTimeMinutes: number;
}>;
export type Output = Readonly<{
  readonly modeledDanielsVdot: number;
  readonly raceMeanMetersPerMinute: number;
}>;
const inputFields = [
  { id: "raceDistanceMeters", label: "Race distance meters", kind: "number" },
  { id: "raceTimeMinutes", label: "Race time minutes", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.raceDistanceMeters, "raceDistanceMeters");
  positive(input.raceTimeMinutes, "raceTimeMinutes");
  bounded(input.raceTimeMinutes, "duration", 1, 1000);
  const velocity = input.raceDistanceMeters / input.raceTimeMinutes;
  if (velocity < 50 || velocity > 500)
    simpleError("velocity", "Running-model branch 50–500 m/min required.");
  const fraction =
      0.8 +
      0.1894393 * Math.exp(-0.012778 * input.raceTimeMinutes) +
      0.2989558 * Math.exp(-0.1932605 * input.raceTimeMinutes),
    oxygen = -4.6 + 0.182258 * velocity + 0.000104 * velocity * velocity;
  return {
    modeledDanielsVdot: oxygen / fraction,
    raceMeanMetersPerMinute: velocity,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  raceDistanceMeters: 5000,
  raceTimeMinutes: 20,
} satisfies Input;
export const exampleOutput = {
  modeledDanielsVdot: 49.806233428066335,
  raceMeanMetersPerMinute: 250,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/vdot-from-race-result",
  title: "VDOT From Race Result Calculator",
  description:
    "Evaluate named Daniels race-performance VDOT regression on bounded running branch; modeled performance score not measured VO2 max, training permission or medical fitness.",
  inputs: inputFields,
  outputs: [
    { id: "modeledDanielsVdot", label: "Modeled daniels vdot", kind: "number" },
    {
      id: "raceMeanMetersPerMinute",
      label: "Race mean meters per minute",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      raceDistanceMeters: value.raceDistanceMeters as number,
      raceTimeMinutes: value.raceTimeMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
