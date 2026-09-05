import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, polygonClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedTasX: number;
  readonly observedTasY: number;
  readonly callerTasClassIds: readonly string[];
  readonly callerTasVertices: readonly (readonly number[])[];
}>;
export type Output = Readonly<{ readonly matchingClasses: readonly string[] }>;
const inputFields = [
  { id: "observedTasX", label: "Observed tas x", kind: "number" },
  { id: "observedTasY", label: "Observed tas y", kind: "number" },
  {
    id: "callerTasClassIds",
    label: "Caller tas class ids",
    kind: "stringList",
  },
  { id: "callerTasVertices", label: "Caller tas vertices", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchingClasses: polygonClasses(
      input.observedTasX,
      input.observedTasY,
      input.callerTasClassIds,
      input.callerTasVertices,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTasX: 0.5,
  observedTasY: 0.5,
  callerTasClassIds: ["a", "b"],
  callerTasVertices: [
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
  id: "geology/tas-classification",
  title: "Geology TAS Classification Lookup",
  description:
    "Silica/total-alkali TAS class coordinates, independently verified same-edition polygons, not plotting bands. Shared boundaries and overlaps retained; polygons must be simple non-self-intersecting. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "matchingClasses", label: "Matching classes", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      observedTasX: value.observedTasX as number,
      observedTasY: value.observedTasY as number,
      callerTasClassIds: value.callerTasClassIds as readonly string[],
      callerTasVertices:
        value.callerTasVertices as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
