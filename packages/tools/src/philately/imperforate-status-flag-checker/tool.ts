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
  integer,
  binary,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedEdgeHoleCounts: readonly number[];
  readonly edgeInspectionKnown: readonly number[];
}>;
export type Output = Readonly<{ readonly status: string }>;
const inputFields = [
  {
    id: "observedEdgeHoleCounts",
    label: "Observed edge hole counts",
    kind: "numberList",
  },
  {
    id: "edgeInspectionKnown",
    label: "Edge inspection known",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedEdgeHoleCounts.forEach((v) =>
    nonnegative(v, "observedEdgeHoleCounts"),
  );
  binary(input.edgeInspectionKnown, "edgeInspectionKnown");
  if (
    input.observedEdgeHoleCounts.length !== 4 ||
    input.edgeInspectionKnown.length !== 4
  )
    simpleError(
      "edges",
      "Exactly four edge inspections; trimmed examples cannot establish original separation.",
    );
  input.observedEdgeHoleCounts.forEach((v) => integer(v, "holes"));
  return {
    status: input.observedEdgeHoleCounts.some(
      (v, i) => input.edgeInspectionKnown[i] && v > 0,
    )
      ? "observed-perforation"
      : input.edgeInspectionKnown.every(Boolean)
        ? "no-observed-perforation"
        : "unknown",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEdgeHoleCounts: [0, 0, 0, 0],
  edgeInspectionKnown: [1, 1, 1, 0],
} satisfies Input;
export const exampleOutput = { status: "unknown" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/imperforate-status-flag-checker",
  title: "Imperforate Status Flag Checker",
  description:
    "Separate no observed perforations from incomplete inspections and original imperforate authenticity. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [{ id: "status", label: "Status", kind: "string" }],
  calculate: (value) =>
    calculate({
      observedEdgeHoleCounts: value.observedEdgeHoleCounts as readonly number[],
      edgeInspectionKnown: value.edgeInspectionKnown as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
