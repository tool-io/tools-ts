import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerProjectDesignClassIds: readonly string[];
  readonly callerProjectDesignRequirements: readonly (readonly number[])[];
  readonly observedProjectDesignEvidence: readonly number[];
  readonly knownProjectDesignFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerProjectDesignClassIds",
    label: "Caller project design class ids",
    kind: "stringList",
  },
  {
    id: "callerProjectDesignRequirements",
    label: "Caller project design requirements",
    kind: "matrix",
  },
  {
    id: "observedProjectDesignEvidence",
    label: "Observed project design evidence",
    kind: "numberList",
  },
  {
    id: "knownProjectDesignFlags",
    label: "Known project design flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerProjectDesignClassIds,
    input.callerProjectDesignRequirements,
    input.observedProjectDesignEvidence,
    input.knownProjectDesignFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerProjectDesignClassIds: ["a", "b"],
  callerProjectDesignRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedProjectDesignEvidence: [1, 0],
  knownProjectDesignFlags: [1, 0],
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
  id: "pedagogy/project-based-learning-gold-standard-design-elements-lookup",
  title: "Project Based Learning Gold Standard Design Elements Lookup",
  description:
    "Compare observed project-design evidence with independently source- and edition-verified Gold Standard PBL requirements. Retains missing evidence and overlapping candidates; not engagement, learning efficacy or program certification.",
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
      callerProjectDesignClassIds:
        value.callerProjectDesignClassIds as readonly string[],
      callerProjectDesignRequirements:
        value.callerProjectDesignRequirements as readonly (readonly number[])[],
      observedProjectDesignEvidence:
        value.observedProjectDesignEvidence as readonly number[],
      knownProjectDesignFlags:
        value.knownProjectDesignFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
