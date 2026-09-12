import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualContributingCisternCatchmentAreaSquareMeters: number;
  readonly callerQualifiedFirstFlushDepthMeters: number;
  readonly callerMatchedRunoffFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualContributingCisternCatchmentAreaSquareMeters",
    label: "Actual contributing cistern catchment area square meters",
    kind: "number",
  },
  {
    id: "callerQualifiedFirstFlushDepthMeters",
    label: "Caller qualified first flush depth meters",
    kind: "number",
  },
  {
    id: "callerMatchedRunoffFraction",
    label: "Caller matched runoff fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualContributingCisternCatchmentAreaSquareMeters,
    "actualContributingCisternCatchmentAreaSquareMeters",
  );
  nonnegative(
    input.callerQualifiedFirstFlushDepthMeters,
    "callerQualifiedFirstFlushDepthMeters",
  );
  fraction(input.callerMatchedRunoffFraction, "callerMatchedRunoffFraction");
  return {
    value:
      input.actualContributingCisternCatchmentAreaSquareMeters *
      input.callerQualifiedFirstFlushDepthMeters *
      input.callerMatchedRunoffFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualContributingCisternCatchmentAreaSquareMeters: 10,
    callerQualifiedFirstFlushDepthMeters: 1,
    callerMatchedRunoffFraction: 0.5,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/cistern-first-flush-diverter-size",
  title: "Plumbing Cistern First Flush Diverter Size Calculator",
  description:
    "Actual first flush collection volume area\u00d7independent diversion depth\u00d7runoff fraction m\u00b3, no universal first flush depth or water pot ability guarantee. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
