import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly sampleIndex: number;
  readonly outsideIndex: number;
  readonly externalEntryIncidenceDegrees: number;
  readonly exitFacetNormalOffsetsDegrees: readonly number[];
  readonly appliedTiltDegrees: number;
}>;
export type Output = Readonly<{
  readonly internalExitIncidencesDegrees: readonly number[];
  readonly totalInternalReflectionFlags: readonly number[];
  readonly transmittedExitAnglesDegrees: readonly number[];
}>;
const inputFields = [
  { id: "sampleIndex", label: "Sample index", kind: "number" },
  { id: "outsideIndex", label: "Outside index", kind: "number" },
  {
    id: "externalEntryIncidenceDegrees",
    label: "External entry incidence degrees",
    kind: "number",
  },
  {
    id: "exitFacetNormalOffsetsDegrees",
    label: "Exit facet normal offsets degrees",
    kind: "numberList",
  },
  { id: "appliedTiltDegrees", label: "Applied tilt degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.sampleIndex, "sampleIndex");
  positive(input.outsideIndex, "outsideIndex");
  nonnegative(
    input.externalEntryIncidenceDegrees,
    "externalEntryIncidenceDegrees",
  );
  if (
    input.sampleIndex <= input.outsideIndex ||
    input.externalEntryIncidenceDegrees >= 90 ||
    Math.abs(input.appliedTiltDegrees) >= 90
  )
    simpleError(
      "ray",
      "Higher sample index and acute external entry/tilt required.",
    );
  const entry = input.externalEntryIncidenceDegrees + input.appliedTiltDegrees;
  if (Math.abs(entry) >= 90)
    simpleError("entry", "Tilted ray outside entry-face hemisphere.");
  const inside =
      (Math.asin(
        (input.outsideIndex / input.sampleIndex) *
          Math.sin((entry * Math.PI) / 180),
      ) *
        180) /
      Math.PI,
    angles = input.exitFacetNormalOffsetsDegrees.map((n) =>
      Math.abs(inside - n),
    );
  if (!angles.length || angles.some((i) => i >= 90))
    simpleError(
      "exit",
      "Nonempty exit facet incidence inside normal hemisphere required.",
    );
  const s = angles.map(
    (i) =>
      (input.sampleIndex / input.outsideIndex) * Math.sin((i * Math.PI) / 180),
  );
  return {
    internalExitIncidencesDegrees: angles,
    totalInternalReflectionFlags: s.map((v) => (v >= 1 ? 1 : 0)),
    transmittedExitAnglesDegrees: s.map((v) =>
      v >= 1 ? 0 : (Math.asin(v) * 180) / Math.PI,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleIndex: 2,
  outsideIndex: 1,
  externalEntryIncidenceDegrees: 0,
  exitFacetNormalOffsetsDegrees: [0, 45],
  appliedTiltDegrees: 0,
} satisfies Input;
export const exampleOutput = {
  internalExitIncidencesDegrees: [0, 45],
  totalInternalReflectionFlags: [0, 1],
  transmittedExitAnglesDegrees: [0, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/light-return-tilt-check",
  title: "Light Return Tilt Check",
  description:
    "Trace supplied meridional entry and exit-facet normals measured relative to the same entry-face normal under declared tilt/index; zero exit angle is unused for TIR flags, and this local-interface screen is not full gemstone light-return simulation.",
  inputs: inputFields,
  outputs: [
    {
      id: "internalExitIncidencesDegrees",
      label: "Internal exit incidences degrees",
      kind: "numberList",
    },
    {
      id: "totalInternalReflectionFlags",
      label: "Total internal reflection flags",
      kind: "numberList",
    },
    {
      id: "transmittedExitAnglesDegrees",
      label: "Transmitted exit angles degrees",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleIndex: value.sampleIndex as number,
      outsideIndex: value.outsideIndex as number,
      externalEntryIncidenceDegrees:
        value.externalEntryIncidenceDegrees as number,
      exitFacetNormalOffsetsDegrees:
        value.exitFacetNormalOffsetsDegrees as readonly number[],
      appliedTiltDegrees: value.appliedTiltDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
