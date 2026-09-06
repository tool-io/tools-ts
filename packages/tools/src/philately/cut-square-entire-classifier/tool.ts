import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerStationeryCutClassIds: readonly string[];
  readonly callerStationeryCutRequirements: readonly (readonly number[])[];
  readonly observedStationeryCutEvidence: readonly number[];
  readonly knownStationeryCutFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerStationeryCutClassIds",
    label: "Caller stationery cut class ids",
    kind: "stringList",
  },
  {
    id: "callerStationeryCutRequirements",
    label: "Caller stationery cut requirements",
    kind: "matrix",
  },
  {
    id: "observedStationeryCutEvidence",
    label: "Observed stationery cut evidence",
    kind: "numberList",
  },
  {
    id: "knownStationeryCutFlags",
    label: "Known stationery cut flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerStationeryCutClassIds,
    input.callerStationeryCutRequirements,
    input.observedStationeryCutEvidence,
    input.knownStationeryCutFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerStationeryCutClassIds: ["a", "b"],
  callerStationeryCutRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedStationeryCutEvidence: [1, 0],
  knownStationeryCutFlags: [1, 0],
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
  id: "philately/cut-square-entire-classifier",
  title: "Postal Stationery Cut Square versus Cut Entire Classifier",
  description:
    "Compare observed stationery piece edge/extent evidence for caller cut-square/entire categories. Independently established positive evidence requirements; overlapping compatible classes and unknowns retained. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerStationeryCutClassIds:
        value.callerStationeryCutClassIds as readonly string[],
      callerStationeryCutRequirements:
        value.callerStationeryCutRequirements as readonly (readonly number[])[],
      observedStationeryCutEvidence:
        value.observedStationeryCutEvidence as readonly number[],
      knownStationeryCutFlags:
        value.knownStationeryCutFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
