import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  sum,
  shape,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly sectionVertices: readonly (readonly number[])[];
  readonly independentRestoredLineLengthM: number;
}>;
export type Output = Readonly<{
  readonly observedLineLengthM: number;
  readonly signedRestorationResidualM: number;
}>;
const inputFields = [
  { id: "sectionVertices", label: "Section vertices", kind: "matrix" },
  {
    id: "independentRestoredLineLengthM",
    label: "Independent restored line length m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.independentRestoredLineLengthM,
    "independentRestoredLineLengthM",
  );
  if (
    shape(input.sectionVertices, "section") !== 2 ||
    input.sectionVertices.length < 2
  )
    simpleError(
      "vertices",
      "At least two actual matched planar section vertices.",
    );
  const l = sum(
    input.sectionVertices
      .slice(1)
      .map(([x, y], i) =>
        Math.hypot(
          x - input.sectionVertices[i][0],
          y - input.sectionVertices[i][1],
        ),
      ),
  );
  return {
    observedLineLengthM: l,
    signedRestorationResidualM: l - input.independentRestoredLineLengthM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sectionVertices: [
    [0, 0],
    [3, 4],
    [6, 4],
  ],
  independentRestoredLineLengthM: 8,
} satisfies Input;
export const exampleOutput = {
  observedLineLengthM: 8,
  signedRestorationResidualM: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/balanced-cross-section-line-length",
  title: "Geology Balanced Cross Section Line Length Calculator",
  description:
    "Balanced cross-section actual polyline arc-length audit against independent restoration evidence, not end-to-end shortcut. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedLineLengthM",
      label: "Observed line length m",
      kind: "number",
    },
    {
      id: "signedRestorationResidualM",
      label: "Signed restoration residual m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sectionVertices: value.sectionVertices as readonly (readonly number[])[],
      independentRestoredLineLengthM:
        value.independentRestoredLineLengthM as number,
    }),
});
export const run = tool.execute;
export default tool;
