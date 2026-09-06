import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerLithographicDotEraClassIds: readonly string[];
  readonly callerLithographicDotEraRequirements: readonly (readonly number[])[];
  readonly observedLithographicDotEraEvidence: readonly number[];
  readonly knownLithographicDotEraFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerLithographicDotEraClassIds",
    label: "Caller lithographic dot era class ids",
    kind: "stringList",
  },
  {
    id: "callerLithographicDotEraRequirements",
    label: "Caller lithographic dot era requirements",
    kind: "matrix",
  },
  {
    id: "observedLithographicDotEraEvidence",
    label: "Observed lithographic dot era evidence",
    kind: "numberList",
  },
  {
    id: "knownLithographicDotEraFlags",
    label: "Known lithographic dot era flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerLithographicDotEraClassIds,
    input.callerLithographicDotEraRequirements,
    input.observedLithographicDotEraEvidence,
    input.knownLithographicDotEraFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerLithographicDotEraClassIds: ["a", "b"],
  callerLithographicDotEraRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedLithographicDotEraEvidence: [1, 0],
  knownLithographicDotEraFlags: [1, 0],
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
  id: "philately/litho-dot-era-classifier",
  title: "Lithography Dot Shape Era Classifier",
  description:
    "Compare independently observed dot morphology and issue context against caller verified printing-era evidence. Independently established positive evidence requirements; overlapping compatible classes and unknowns retained. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerLithographicDotEraClassIds:
        value.callerLithographicDotEraClassIds as readonly string[],
      callerLithographicDotEraRequirements:
        value.callerLithographicDotEraRequirements as readonly (readonly number[])[],
      observedLithographicDotEraEvidence:
        value.observedLithographicDotEraEvidence as readonly number[],
      knownLithographicDotEraFlags:
        value.knownLithographicDotEraFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
