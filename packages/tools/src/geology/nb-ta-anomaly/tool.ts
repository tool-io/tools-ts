import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedNbTaNeighbors: readonly number[];
  readonly callerMatchedReferenceConcentrations: readonly number[];
}>;
export type Output = Readonly<{
  readonly normalizedNbAnomaly: number;
  readonly normalizedTaAnomaly: number;
}>;
const inputFields = [
  {
    id: "observedNbTaNeighbors",
    label: "Observed nb ta neighbors",
    kind: "numberList",
  },
  {
    id: "callerMatchedReferenceConcentrations",
    label: "Caller matched reference concentrations",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedNbTaNeighbors.forEach((v) =>
    positive(v, "observedNbTaNeighbors"),
  );
  input.callerMatchedReferenceConcentrations.forEach((v) =>
    positive(v, "callerMatchedReferenceConcentrations"),
  );
  if (
    input.observedNbTaNeighbors.length !== 4 ||
    input.callerMatchedReferenceConcentrations.length !== 4
  )
    simpleError(
      "elements",
      "OrderedNb, Ta, and independently chosen bracketing left/right neighbor concentrations.",
    );
  const [n, t, l, r] = input.observedNbTaNeighbors.map(
      (v, i) => v / input.callerMatchedReferenceConcentrations[i],
    ),
    base = Math.sqrt(l * r);
  return { normalizedNbAnomaly: n / base, normalizedTaAnomaly: t / base };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedNbTaNeighbors: [2, 3, 2, 3],
  callerMatchedReferenceConcentrations: [1, 1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  normalizedNbAnomaly: 0.8164965809277261,
  normalizedTaAnomaly: 1.2247448713915892,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/nb-ta-anomaly",
  title: "Geology Nb Ta Anomaly Calculator",
  description:
    "Nb/Ta anomalies against geometric interpolation of independently specified normalized bracketing trace elements; reference/order explicitly caller established, not Ce/Eu substitution. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "normalizedNbAnomaly",
      label: "Normalized nb anomaly",
      kind: "number",
    },
    {
      id: "normalizedTaAnomaly",
      label: "Normalized ta anomaly",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedNbTaNeighbors: value.observedNbTaNeighbors as readonly number[],
      callerMatchedReferenceConcentrations:
        value.callerMatchedReferenceConcentrations as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
