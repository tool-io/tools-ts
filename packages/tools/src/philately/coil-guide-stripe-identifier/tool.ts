import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerCoilGuideStripeClassIds: readonly string[];
  readonly callerCoilGuideStripeRequirements: readonly (readonly number[])[];
  readonly observedCoilGuideStripeEvidence: readonly number[];
  readonly knownCoilGuideStripeFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerCoilGuideStripeClassIds",
    label: "Caller coil guide stripe class ids",
    kind: "stringList",
  },
  {
    id: "callerCoilGuideStripeRequirements",
    label: "Caller coil guide stripe requirements",
    kind: "matrix",
  },
  {
    id: "observedCoilGuideStripeEvidence",
    label: "Observed coil guide stripe evidence",
    kind: "numberList",
  },
  {
    id: "knownCoilGuideStripeFlags",
    label: "Known coil guide stripe flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerCoilGuideStripeClassIds,
    input.callerCoilGuideStripeRequirements,
    input.observedCoilGuideStripeEvidence,
    input.knownCoilGuideStripeFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCoilGuideStripeClassIds: ["a", "b"],
  callerCoilGuideStripeRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedCoilGuideStripeEvidence: [1, 0],
  knownCoilGuideStripeFlags: [1, 0],
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
  id: "philately/coil-guide-stripe-identifier",
  title: "Coil Waste Line Guide Stripe Identifier",
  description:
    "Compare observed coil guide-stripe witnesses against caller reference patterns. Independently established positive evidence requirements; overlapping compatible classes and unknowns retained. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerCoilGuideStripeClassIds:
        value.callerCoilGuideStripeClassIds as readonly string[],
      callerCoilGuideStripeRequirements:
        value.callerCoilGuideStripeRequirements as readonly (readonly number[])[],
      observedCoilGuideStripeEvidence:
        value.observedCoilGuideStripeEvidence as readonly number[],
      knownCoilGuideStripeFlags:
        value.knownCoilGuideStripeFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
