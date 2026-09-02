import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  unique,
  sum,
  shape,
  ordered,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedSandSiltClayPercent: readonly number[];
  readonly callerTextureClassIds: readonly string[];
  readonly callerSandSiltClayLowerPercent: readonly (readonly number[])[];
  readonly callerSandSiltClayUpperPercent: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly matchingCallerTextureClassIds: readonly string[];
}>;
const inputFields = [
  {
    id: "observedSandSiltClayPercent",
    label: "Observed sand silt clay percent",
    kind: "numberList",
  },
  {
    id: "callerTextureClassIds",
    label: "Caller texture class ids",
    kind: "stringList",
  },
  {
    id: "callerSandSiltClayLowerPercent",
    label: "Caller sand silt clay lower percent",
    kind: "matrix",
  },
  {
    id: "callerSandSiltClayUpperPercent",
    label: "Caller sand silt clay upper percent",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.observedSandSiltClayPercent.length !== 3 ||
    Math.abs(sum(input.observedSandSiltClayPercent) - 100) > 1e-8
  )
    simpleError(
      "texture",
      "Closed sand/silt/clay percent composition sums 100.",
    );
  input.observedSandSiltClayPercent.forEach((v) => {
    if (v < 0 || v > 100) simpleError("fraction", "0–100 percent.");
  });
  if (
    shape(input.callerSandSiltClayLowerPercent, "lower") !== 3 ||
    shape(input.callerSandSiltClayUpperPercent, "upper") !== 3
  )
    simpleError(
      "bands",
      "Three sand/silt/clay coordinates per independently verified class band.",
    );
  aligned(
    input.callerTextureClassIds,
    input.callerSandSiltClayLowerPercent,
    "classes",
  );
  aligned(
    input.callerTextureClassIds,
    input.callerSandSiltClayUpperPercent,
    "classes",
  );
  unique(input.callerTextureClassIds, "classes");
  input.callerSandSiltClayLowerPercent.forEach((r, i) =>
    r.forEach((v, j) => {
      if (v < 0 || input.callerSandSiltClayUpperPercent[i][j] > 100)
        simpleError("band", "Bounded0–100 percent criteria.");
      ordered(v, input.callerSandSiltClayUpperPercent[i][j]);
    }),
  );
  return {
    matchingCallerTextureClassIds: input.callerTextureClassIds.filter((_, i) =>
      input.observedSandSiltClayPercent.every(
        (v, j) =>
          v >= input.callerSandSiltClayLowerPercent[i][j] &&
          v <= input.callerSandSiltClayUpperPercent[i][j],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSandSiltClayPercent: [40, 40, 20],
  callerTextureClassIds: ["loam", "overlap"],
  callerSandSiltClayLowerPercent: [
    [30, 30, 10],
    [40, 40, 20],
  ],
  callerSandSiltClayUpperPercent: [
    [50, 50, 30],
    [40, 40, 20],
  ],
} satisfies Input;
export const exampleOutput = {
  matchingCallerTextureClassIds: ["loam", "overlap"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/soil-texture-triangle-lookup",
  title: "Agriculture Soil Texture Triangle Lookup Calculator",
  description:
    "Screen caller independently verified sand/silt/clay linear-band texture regions, shared inclusive boundaries retain every match, not a fabricated USDA triangle table. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchingCallerTextureClassIds",
      label: "Matching caller texture class ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSandSiltClayPercent:
        value.observedSandSiltClayPercent as readonly number[],
      callerTextureClassIds: value.callerTextureClassIds as readonly string[],
      callerSandSiltClayLowerPercent:
        value.callerSandSiltClayLowerPercent as readonly (readonly number[])[],
      callerSandSiltClayUpperPercent:
        value.callerSandSiltClayUpperPercent as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
