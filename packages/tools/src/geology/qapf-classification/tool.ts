import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, polygonClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedQapfX: number;
  readonly observedQapfY: number;
  readonly callerQapfClassIds: readonly string[];
  readonly callerQapfVertices: readonly (readonly number[])[];
}>;
export type Output = Readonly<{ readonly matchingClasses: readonly string[] }>;
const inputFields = [
  { id: "observedQapfX", label: "Observed qapf x", kind: "number" },
  { id: "observedQapfY", label: "Observed qapf y", kind: "number" },
  {
    id: "callerQapfClassIds",
    label: "Caller qapf class ids",
    kind: "stringList",
  },
  { id: "callerQapfVertices", label: "Caller qapf vertices", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchingClasses: polygonClasses(
      input.observedQapfX,
      input.observedQapfY,
      input.callerQapfClassIds,
      input.callerQapfVertices,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedQapfX: 0.5,
  observedQapfY: 0.5,
  callerQapfClassIds: ["a", "b"],
  callerQapfVertices: [
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
  id: "geology/qapf-classification",
  title: "Geology QAPF Classification Lookup",
  description:
    "Independently normalized same-triangle QAPF coordinates and verified polygons; caller resolves quartz/feldspathoid conflict and triangle basis. Shared boundaries and overlaps retained; polygons must be simple non-self-intersecting. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "matchingClasses", label: "Matching classes", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      observedQapfX: value.observedQapfX as number,
      observedQapfY: value.observedQapfY as number,
      callerQapfClassIds: value.callerQapfClassIds as readonly string[],
      callerQapfVertices:
        value.callerQapfVertices as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
