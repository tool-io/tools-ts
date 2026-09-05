import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, polygonClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedLog2Precipitation: number;
  readonly observedLog2Biotemperature: number;
  readonly callerHoldridgeClassIds: readonly string[];
  readonly callerSameTrianglePolygons: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly matchingLifeZones: readonly string[];
}>;
const inputFields = [
  {
    id: "observedLog2Precipitation",
    label: "Observed log2 precipitation",
    kind: "number",
  },
  {
    id: "observedLog2Biotemperature",
    label: "Observed log2 biotemperature",
    kind: "number",
  },
  {
    id: "callerHoldridgeClassIds",
    label: "Caller holdridge class ids",
    kind: "stringList",
  },
  {
    id: "callerSameTrianglePolygons",
    label: "Caller same triangle polygons",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchingLifeZones: polygonClasses(
      input.observedLog2Precipitation,
      input.observedLog2Biotemperature,
      input.callerHoldridgeClassIds,
      input.callerSameTrianglePolygons,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLog2Precipitation: 2,
  observedLog2Biotemperature: 1,
  callerHoldridgeClassIds: ["a"],
  callerSameTrianglePolygons: [
    [0, 0, 0],
    [0, 4, 0],
    [0, 4, 4],
    [0, 0, 4],
  ],
} satisfies Input;
export const exampleOutput = { matchingLifeZones: ["a"] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/holdridge-life-zone-classifier",
  title: "Holdridge Life Zone Classifier",
  description:
    "Actual independently established Holdridge biotemperature/precipitation log coordinates against caller same-triangle verified zones, PET/aridity transform/context externally established; no Köppen duplicate. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchingLifeZones",
      label: "Matching life zones",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLog2Precipitation: value.observedLog2Precipitation as number,
      observedLog2Biotemperature: value.observedLog2Biotemperature as number,
      callerHoldridgeClassIds:
        value.callerHoldridgeClassIds as readonly string[],
      callerSameTrianglePolygons:
        value.callerSameTrianglePolygons as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
