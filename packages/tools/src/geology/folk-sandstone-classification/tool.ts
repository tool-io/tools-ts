import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, polygonClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedFolkX: number;
  readonly observedFolkY: number;
  readonly callerFolkClassIds: readonly string[];
  readonly callerFolkVertices: readonly (readonly number[])[];
}>;
export type Output = Readonly<{ readonly matchingClasses: readonly string[] }>;
const inputFields = [
  { id: "observedFolkX", label: "Observed folk x", kind: "number" },
  { id: "observedFolkY", label: "Observed folk y", kind: "number" },
  {
    id: "callerFolkClassIds",
    label: "Caller folk class ids",
    kind: "stringList",
  },
  { id: "callerFolkVertices", label: "Caller folk vertices", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchingClasses: polygonClasses(
      input.observedFolkX,
      input.observedFolkY,
      input.callerFolkClassIds,
      input.callerFolkVertices,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFolkX: 0.5,
  observedFolkY: 0.5,
  callerFolkClassIds: ["a", "b"],
  callerFolkVertices: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 1, 1],
    [0, 0, 1],
    [1, 0.5, 0.5],
    [1, 2, 0.5],
    [1, 2, 2],
    [1, 0.5, 2],
  ],
} satisfies Input;
export const exampleOutput = { matchingClasses: ["a", "b"] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/folk-sandstone-classification",
  title: "Geology Folk Sandstone Classification Lookup",
  description:
    "Normalized QFL framework coordinates against caller verified same-method Folk polygons, matrix fraction externally established. Shared boundaries and overlaps retained; polygons must be simple non-self-intersecting. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "matchingClasses", label: "Matching classes", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      observedFolkX: value.observedFolkX as number,
      observedFolkY: value.observedFolkY as number,
      callerFolkClassIds: value.callerFolkClassIds as readonly string[],
      callerFolkVertices:
        value.callerFolkVertices as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
