import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerDunhamFabricClassIds: readonly string[];
  readonly callerDunhamFabricRequiredEvidence: readonly (readonly number[])[];
  readonly observedDunhamFabricEvidence: readonly number[];
  readonly knownDunhamFabricEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerDunhamFabricClassIds",
    label: "Caller dunham fabric class ids",
    kind: "stringList",
  },
  {
    id: "callerDunhamFabricRequiredEvidence",
    label: "Caller dunham fabric required evidence",
    kind: "matrix",
  },
  {
    id: "observedDunhamFabricEvidence",
    label: "Observed dunham fabric evidence",
    kind: "numberList",
  },
  {
    id: "knownDunhamFabricEvidenceFlags",
    label: "Known dunham fabric evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerDunhamFabricClassIds,
    input.callerDunhamFabricRequiredEvidence,
    input.observedDunhamFabricEvidence,
    input.knownDunhamFabricEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerDunhamFabricClassIds: ["a", "b"],
  callerDunhamFabricRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedDunhamFabricEvidence: [1, 0],
  knownDunhamFabricEvidenceFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  compatibleCallerClasses: ["a", "b"],
  fullyWitnessedCallerClasses: ["a"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/dunham-carbonate-classification",
  title: "Geology Dunham Carbonate Classification Lookup",
  description:
    "Screen depositional texture/mud/grain-support evidence under caller Dunham criteria; not identification by grain size alone. Independently declared positive evidence requirements; overlapping/unknown classes retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "compatibleCallerClasses",
      label: "Compatible caller classes",
      kind: "stringList",
    },
    {
      id: "fullyWitnessedCallerClasses",
      label: "Fully witnessed caller classes",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerDunhamFabricClassIds:
        value.callerDunhamFabricClassIds as readonly string[],
      callerDunhamFabricRequiredEvidence:
        value.callerDunhamFabricRequiredEvidence as readonly (readonly number[])[],
      observedDunhamFabricEvidence:
        value.observedDunhamFabricEvidence as readonly number[],
      knownDunhamFabricEvidenceFlags:
        value.knownDunhamFabricEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
