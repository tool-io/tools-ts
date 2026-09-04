import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedElmInfectedMaterialKg: readonly number[];
  readonly observedVerifiedRemovedMaterialKg: readonly number[];
  readonly knownRemovalAssessmentFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownResidualElmMaterialKg: number;
  readonly unassessedOriginalElmMaterialKg: number;
}>;
const inputFields = [
  {
    id: "observedElmInfectedMaterialKg",
    label: "Observed elm infected material kg",
    kind: "numberList",
  },
  {
    id: "observedVerifiedRemovedMaterialKg",
    label: "Observed verified removed material kg",
    kind: "numberList",
  },
  {
    id: "knownRemovalAssessmentFlags",
    label: "Known removal assessment flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedElmInfectedMaterialKg.forEach((v) =>
    nonnegative(v, "observedElmInfectedMaterialKg"),
  );
  input.observedVerifiedRemovedMaterialKg.forEach((v) =>
    nonnegative(v, "observedVerifiedRemovedMaterialKg"),
  );
  binary(input.knownRemovalAssessmentFlags, "knownRemovalAssessmentFlags");
  aligned(
    input.observedElmInfectedMaterialKg,
    input.observedVerifiedRemovedMaterialKg,
    "observedElmInfectedMaterialKg",
  );
  aligned(
    input.observedElmInfectedMaterialKg,
    input.knownRemovalAssessmentFlags,
    "observedElmInfectedMaterialKg",
  );
  input.observedVerifiedRemovedMaterialKg.forEach((v, i) => {
    if (
      input.knownRemovalAssessmentFlags[i] &&
      v > input.observedElmInfectedMaterialKg[i]
    )
      simpleError("removal", "Matched observed removal≤original material.");
  });
  return {
    knownResidualElmMaterialKg: sum(
      input.observedElmInfectedMaterialKg.map((v, i) =>
        input.knownRemovalAssessmentFlags[i]
          ? v - input.observedVerifiedRemovedMaterialKg[i]
          : 0,
      ),
    ),
    unassessedOriginalElmMaterialKg: sum(
      input.observedElmInfectedMaterialKg.filter(
        (_, i) => !input.knownRemovalAssessmentFlags[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedElmInfectedMaterialKg: [2, 3],
  observedVerifiedRemovedMaterialKg: [1, 3],
  knownRemovalAssessmentFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  knownResidualElmMaterialKg: 1,
  unassessedOriginalElmMaterialKg: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/dutch-elm-disease-vector-pressure-sanitation-checker",
  title: "Dutch Elm Disease Sanitation Pressure Checker",
  description:
    "Reconcile independently identified Dutch-elm infected material/removal evidence separately from unknown sanitation observations; no disease/vector pressure causality or sanitation prescription. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownResidualElmMaterialKg",
      label: "Known residual elm material kg",
      kind: "number",
    },
    {
      id: "unassessedOriginalElmMaterialKg",
      label: "Unassessed original elm material kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedElmInfectedMaterialKg:
        value.observedElmInfectedMaterialKg as readonly number[],
      observedVerifiedRemovedMaterialKg:
        value.observedVerifiedRemovedMaterialKg as readonly number[],
      knownRemovalAssessmentFlags:
        value.knownRemovalAssessmentFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
