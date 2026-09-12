import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  mean,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedTargetRoiTracerConcentrations: readonly number[];
  readonly actualQualifiedReferenceRoiTracerConcentrations: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedTargetRoiTracerConcentrations",
    label: "Actual qualified target roi tracer concentrations",
    kind: "numberList",
  },
  {
    id: "actualQualifiedReferenceRoiTracerConcentrations",
    label: "Actual qualified reference roi tracer concentrations",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualQualifiedTargetRoiTracerConcentrations.length)
    simpleError(
      "actualQualifiedTargetRoiTracerConcentrations",
      "Actual nonempty observations.",
    );
  input.actualQualifiedTargetRoiTracerConcentrations.forEach((v) =>
    nonnegative(v, "actualQualifiedTargetRoiTracerConcentrations"),
  );
  if (!input.actualQualifiedReferenceRoiTracerConcentrations.length)
    simpleError(
      "actualQualifiedReferenceRoiTracerConcentrations",
      "Actual nonempty observations.",
    );
  input.actualQualifiedReferenceRoiTracerConcentrations.forEach((v) =>
    nonnegative(v, "actualQualifiedReferenceRoiTracerConcentrations"),
  );
  positive(
    mean(input.actualQualifiedReferenceRoiTracerConcentrations),
    "reference",
  );
  return {
    value:
      mean(input.actualQualifiedTargetRoiTracerConcentrations) /
      mean(input.actualQualifiedReferenceRoiTracerConcentrations),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQualifiedTargetRoiTracerConcentrations: [2, 4],
    actualQualifiedReferenceRoiTracerConcentrations: [1, 2],
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/fdg-pet-suvr",
  title: "FDG PET SUVR Calculator",
  description:
    "Actual FDG PET SUVR Calculator ROI mean target/reference concentration ratio, matched acquisition/timing/tracer, pool/reference selection external; not amyloidcentiloid or biological diagnosis. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
