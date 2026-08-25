import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StretchWrapFilmLengthNeededInput = {
  readonly loadLengthM: number;
  readonly loadWidthM: number;
  readonly wrapRevolutions: number;
  readonly filmElongationPercent?: number;
};

export type StretchWrapFilmLengthNeededOutput = {
  readonly loadPerimeterM: number;
  readonly wrappedPathLengthM: number;
  readonly unstretchedFilmLengthM: number;
};

export const calculateStretchWrapFilmLengthNeeded = (
  input: StretchWrapFilmLengthNeededInput,
): StretchWrapFilmLengthNeededOutput => {
  for (const key of ["loadLengthM", "loadWidthM"] as const) {
    if (!Number.isFinite(input[key]) || input[key] <= 0)
      return simpleError(
        key,
        "Load dimensions must be finite and greater than zero.",
        "invalid_dimension",
      );
  }
  if (!(
    Number.isSafeInteger(input.wrapRevolutions) && input.wrapRevolutions >= 1
  ))
    return simpleError(
      "wrapRevolutions",
      "The revolution count must be a whole number of at least one.",
      "invalid_revolutions",
    );
  const filmElongationPercent = input.filmElongationPercent ?? 0;
  if (!Number.isFinite(filmElongationPercent) || filmElongationPercent < 0)
    return simpleError(
      "filmElongationPercent",
      "Film elongation must be finite and non-negative.",
      "invalid_percent",
    );
  const loadPerimeterM = 2 * (input.loadLengthM + input.loadWidthM);
  const wrappedPathLengthM = input.wrapRevolutions * loadPerimeterM;
  const unstretchedFilmLengthM =
    wrappedPathLengthM / (1 + filmElongationPercent / 100);
  if (!Number.isFinite(loadPerimeterM) || !Number.isFinite(wrappedPathLengthM))
    return simpleError(
      "wrapRevolutions",
      "The wrapped path length is outside the representable range.",
      "length_out_of_range",
    );
  if (!Number.isFinite(unstretchedFilmLengthM) || unstretchedFilmLengthM <= 0)
    return simpleError(
      "filmElongationPercent",
      "The unstretched film length is outside the representable range.",
      "film_length_out_of_range",
    );
  return {
    loadPerimeterM,
    wrappedPathLengthM,
    unstretchedFilmLengthM,
  };
};

export const stretchWrapFilmLengthNeededExample = {
  input: {
    loadLengthM: 1.2,
    loadWidthM: 1,
    wrapRevolutions: 12,
    filmElongationPercent: 150,
  },
  output: {
    loadPerimeterM: 4.4,
    wrappedPathLengthM: 52.800000000000004,
    unstretchedFilmLengthM: 21.12,
  },
} satisfies ToolExample<
  StretchWrapFilmLengthNeededInput,
  StretchWrapFilmLengthNeededOutput
>;

export const stretchWrapFilmLengthNeededTool = createSimpleTool({
  id: "logistics/stretch-wrap-film-length-needed",
  title: "Stretch Wrap Film Length Needed",
  description:
    "Estimate pallet wrap film by multiplying revolutions around the load by its perimeter, then dividing by the film's percent elongation to get unstretched length.",
  inputs: [
    {
      description: "Pallet load length in metres.",
      id: "loadLengthM",
      kind: "number",
      label: "Length",
      minimum: Number.MIN_VALUE,
      unit: "m",
    },
    {
      description: "Pallet load width in metres.",
      id: "loadWidthM",
      kind: "number",
      label: "Width",
      minimum: Number.MIN_VALUE,
      unit: "m",
    },
    {
      description: "Number of revolutions the wrapper makes around the load.",
      id: "wrapRevolutions",
      kind: "integer",
      label: "Revolutions",
      minimum: 1,
    },
    {
      default: 0,
      description:
        "Machine stretch as a percent elongation (e.g. 150 means the film reaches 250% of its original length); zero assumes no stretch.",
      id: "filmElongationPercent",
      kind: "number",
      label: "Elongation %",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Distance around one revolution in metres.",
      id: "loadPerimeterM",
      kind: "number",
      label: "Perimeter",
      minimum: Number.MIN_VALUE,
      unit: "m",
    },
    {
      description: "Total stretched path length wrapped in metres.",
      id: "wrappedPathLengthM",
      kind: "number",
      label: "Wrapped path",
      minimum: Number.MIN_VALUE,
      unit: "m",
    },
    {
      description: "Unstretched film length consumed in metres.",
      id: "unstretchedFilmLengthM",
      kind: "number",
      label: "Film length",
      minimum: Number.MIN_VALUE,
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateStretchWrapFilmLengthNeeded({
      filmElongationPercent: input.filmElongationPercent as number | undefined,
      loadLengthM: input.loadLengthM as number,
      loadWidthM: input.loadWidthM as number,
      wrapRevolutions: input.wrapRevolutions as number,
    }),
});

export const runStretchWrapFilmLengthNeeded =
  stretchWrapFilmLengthNeededTool.execute;
export default stretchWrapFilmLengthNeededTool;
