import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly sourceUvContent: number;
  readonly filmVisibleTransmissionFraction: number;
  readonly callerMaximumFilteredUvContent: number;
}>;
export type Output = Readonly<{
  readonly maximumUvTransmissionFraction: number;
  readonly minimumUvRejectionPercent: number;
}>;
const inputFields = [
  { id: "sourceUvContent", label: "Source uv content", kind: "number" },
  {
    id: "filmVisibleTransmissionFraction",
    label: "Film visible transmission fraction",
    kind: "number",
  },
  {
    id: "callerMaximumFilteredUvContent",
    label: "Caller maximum filtered uv content",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.sourceUvContent, "sourceUvContent");
  positive(
    input.filmVisibleTransmissionFraction,
    "filmVisibleTransmissionFraction",
  );
  nonnegative(
    input.callerMaximumFilteredUvContent,
    "callerMaximumFilteredUvContent",
  );
  fraction(
    input.filmVisibleTransmissionFraction,
    "filmVisibleTransmissionFraction",
  );
  const t = Math.min(
    1,
    (input.callerMaximumFilteredUvContent *
      input.filmVisibleTransmissionFraction) /
      input.sourceUvContent,
  );
  return {
    maximumUvTransmissionFraction: t,
    minimumUvRejectionPercent: 100 * (1 - t),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sourceUvContent: 100,
  filmVisibleTransmissionFraction: 0.8,
  callerMaximumFilteredUvContent: 25,
} satisfies Input;
export const exampleOutput = {
  maximumUvTransmissionFraction: 0.2,
  minimumUvRejectionPercent: 80,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/uv-filter-film-percentage",
  title: "UV Filter Film Percentage Requirement Calculator",
  description:
    "Resolve required UV filtering while separately accounting visible attenuation, since UV per lumen changes with both; supplied spectra/content are measured assumptions, not film performance certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "maximumUvTransmissionFraction",
      label: "Maximum uv transmission fraction",
      kind: "number",
    },
    {
      id: "minimumUvRejectionPercent",
      label: "Minimum uv rejection percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sourceUvContent: value.sourceUvContent as number,
      filmVisibleTransmissionFraction:
        value.filmVisibleTransmissionFraction as number,
      callerMaximumFilteredUvContent:
        value.callerMaximumFilteredUvContent as number,
    }),
});
export const run = tool.execute;
export default tool;
