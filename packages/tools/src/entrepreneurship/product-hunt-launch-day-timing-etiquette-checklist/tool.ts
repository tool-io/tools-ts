import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  acyclicEdges,
  finish,
  bounded,
  aligned,
  binary,
  unique,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerLaunchEtiquetteStepIds: readonly string[];
  readonly callerLaunchEtiquettePrerequisiteEdges: readonly (readonly number[])[];
  readonly observedLaunchEtiquetteCompletedFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly missingPrerequisiteStepIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerLaunchEtiquetteStepIds",
    label: "Caller launch etiquette step ids",
    kind: "stringList",
  },
  {
    id: "callerLaunchEtiquettePrerequisiteEdges",
    label: "Caller launch etiquette prerequisite edges",
    kind: "matrix",
  },
  {
    id: "observedLaunchEtiquetteCompletedFlags",
    label: "Observed launch etiquette completed flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.observedLaunchEtiquetteCompletedFlags,
    "observedLaunchEtiquetteCompletedFlags",
  );
  aligned(
    input.callerLaunchEtiquetteStepIds,
    input.observedLaunchEtiquetteCompletedFlags,
    "callerLaunchEtiquetteStepIds",
  );
  unique(input.callerLaunchEtiquetteStepIds, "steps");
  acyclicEdges(
    input.callerLaunchEtiquetteStepIds.length,
    input.callerLaunchEtiquettePrerequisiteEdges,
  );
  const missing = new Set<number>();
  for (const [a, b] of input.callerLaunchEtiquettePrerequisiteEdges) {
    bounded(
      a,
      "prerequisite",
      0,
      input.callerLaunchEtiquetteStepIds.length - 1,
    );
    bounded(b, "dependent", 0, input.callerLaunchEtiquetteStepIds.length - 1);
    if (a === b) simpleError("edge", "No self dependency.");
    if (
      input.observedLaunchEtiquetteCompletedFlags[b] &&
      !input.observedLaunchEtiquetteCompletedFlags[a]
    )
      missing.add(a);
  }
  return {
    missingPrerequisiteStepIds: input.callerLaunchEtiquetteStepIds.filter(
      (_, i) => missing.has(i),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerLaunchEtiquetteStepIds: ["a", "b", "c"],
  callerLaunchEtiquettePrerequisiteEdges: [
    [0, 1],
    [1, 2],
  ],
  observedLaunchEtiquetteCompletedFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  missingPrerequisiteStepIds: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/product-hunt-launch-day-timing-etiquette-checklist",
  title: "Product Hunt Launch Day Timing Etiquette Checklist",
  description:
    "Caller independently confirmed platform/date launch requirements and stage order, not currentProductHuntpolicy. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "missingPrerequisiteStepIds",
      label: "Missing prerequisite step ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerLaunchEtiquetteStepIds:
        value.callerLaunchEtiquetteStepIds as readonly string[],
      callerLaunchEtiquettePrerequisiteEdges:
        value.callerLaunchEtiquettePrerequisiteEdges as readonly (readonly number[])[],
      observedLaunchEtiquetteCompletedFlags:
        value.observedLaunchEtiquetteCompletedFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
