import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly temperature850C: number;
  readonly temperature500C: number;
  readonly dewpoint850C: number;
  readonly wind850Knots: number;
  readonly wind500Knots: number;
  readonly wind850FromDegrees: number;
  readonly wind500FromDegrees: number;
}>;
export type Output = Readonly<{
  readonly sweatIndex: number;
  readonly directionalShearTerm: number;
}>;
const inputFields = [
  { id: "temperature850C", label: "Temperature850 c", kind: "number" },
  { id: "temperature500C", label: "Temperature500 c", kind: "number" },
  { id: "dewpoint850C", label: "Dewpoint850 c", kind: "number" },
  { id: "wind850Knots", label: "Wind850 knots", kind: "number" },
  { id: "wind500Knots", label: "Wind500 knots", kind: "number" },
  { id: "wind850FromDegrees", label: "Wind850 from degrees", kind: "number" },
  { id: "wind500FromDegrees", label: "Wind500 from degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.wind850Knots, "wind850Knots");
  nonnegative(input.wind500Knots, "wind500Knots");
  nonnegative(input.wind850FromDegrees, "wind850FromDegrees");
  nonnegative(input.wind500FromDegrees, "wind500FromDegrees");
  if (
    input.wind850FromDegrees >= 360 ||
    input.wind500FromDegrees >= 360 ||
    input.dewpoint850C > input.temperature850C
  )
    simpleError(
      "sounding",
      "Physical dewpoint and [0,360) wind-from directions required.",
    );
  const tt =
      input.temperature850C + input.dewpoint850C - 2 * input.temperature500C,
    eligible =
      input.wind850FromDegrees >= 130 &&
      input.wind850FromDegrees <= 250 &&
      input.wind500FromDegrees >= 210 &&
      input.wind500FromDegrees <= 310 &&
      input.wind500FromDegrees > input.wind850FromDegrees &&
      input.wind850Knots >= 15 &&
      input.wind500Knots >= 15,
    directionalShearTerm = eligible
      ? 125 *
        (Math.sin(
          ((input.wind500FromDegrees - input.wind850FromDegrees) * Math.PI) /
            180,
        ) +
          0.2)
      : 0;
  return {
    sweatIndex:
      12 * Math.max(0, input.dewpoint850C) +
      20 * Math.max(0, tt - 49) +
      2 * input.wind850Knots +
      input.wind500Knots +
      directionalShearTerm,
    directionalShearTerm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  temperature850C: 20,
  temperature500C: -10,
  dewpoint850C: 10,
  wind850Knots: 20,
  wind500Knots: 20,
  wind850FromDegrees: 180,
  wind500FromDegrees: 270,
} satisfies Input;
export const exampleOutput = {
  sweatIndex: 350,
  directionalShearTerm: 150,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/sweat-index-severe",
  title: "SWEAT Index Severe",
  description:
    "Evaluate named SWEAT with dewpoint/total-totals truncation and conventional direction/speed gates on shear term, explicit knots/wind-from degrees; not a calibrated warning or severe-weather probability.",
  inputs: inputFields,
  outputs: [
    { id: "sweatIndex", label: "Sweat index", kind: "number" },
    {
      id: "directionalShearTerm",
      label: "Directional shear term",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      temperature850C: value.temperature850C as number,
      temperature500C: value.temperature500C as number,
      dewpoint850C: value.dewpoint850C as number,
      wind850Knots: value.wind850Knots as number,
      wind500Knots: value.wind500Knots as number,
      wind850FromDegrees: value.wind850FromDegrees as number,
      wind500FromDegrees: value.wind500FromDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
