import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  simpson,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualNormalizedArcEndpoint: number;
  readonly callerLemniscateScale: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualNormalizedArcEndpoint",
    label: "Actual normalized arc endpoint",
    kind: "number",
  },
  {
    id: "callerLemniscateScale",
    label: "Caller lemniscate scale",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualNormalizedArcEndpoint, "actualNormalizedArcEndpoint");
  positive(input.callerLemniscateScale, "callerLemniscateScale");
  if (input.actualNormalizedArcEndpoint > 0.99)
    simpleError("u", "Resolvedendpointu≤.99.");
  return {
    value:
      simpson(
        (t) => 1 / Math.sqrt(1 - t ** 4),
        0,
        input.actualNormalizedArcEndpoint,
        512,
      ) * input.callerLemniscateScale,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualNormalizedArcEndpoint: 0, callerLemniscateScale: 1 },
  output: { result: { value: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/lemniscate-arc-length-approx",
  title: "Lemniscate Arc Length Approximation",
  description:
    "RestrictedBernoullilemniscatequadrantarcscale\u00d7integral0\u2026u dt/\u221a(1\u2212t\u2074),0\u2264u\u2264.99, no endpoint-singular naive quadrature.",
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
