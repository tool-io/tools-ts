import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  aligned,
  binary,
} from "../batch53-shared.js";

export type Input = Readonly<{
  reciprocalDilutions: readonly number[];
  fixationPresent: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "reciprocalDilutions",
    label: "Reciprocal dilutions",
    kind: "numberList",
  },
  { id: "fixationPresent", label: "Fixation present", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  aligned(i.reciprocalDilutions, i.fixationPresent, "assay");
  binary(i.fixationPresent, "fixation");
  if (!i.reciprocalDilutions.length)
    simpleError("dilutions", "Observed dilution series required.");
  i.reciprocalDilutions.forEach((v, j) => {
    positive(v, "dilution");
    if (j && v !== 2 * i.reciprocalDilutions[j - 1])
      simpleError("dilution", "Twofold reciprocal chain required.");
  });
  const hit = i.reciprocalDilutions.filter(
    (_, j) => i.fixationPresent[j] === 1,
  );
  return {
    observedEndpointReciprocal: hit.length ? Math.max(...hit) : null,
    rightCensored: i.fixationPresent.at(-1) === 1,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { reciprocalDilutions: [2, 4, 8], fixationPresent: [1, 1, 0] },
  output: { result: { observedEndpointReciprocal: 4, rightCensored: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/complement-fixation-two-fold-recorder",
  title: "Complement Fixation Test Two-Fold Titer Recorder",
  description:
    "Record complement fixation endpoints from explicit observed twofold dilutions; preserve no endpoint and right censoring.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
