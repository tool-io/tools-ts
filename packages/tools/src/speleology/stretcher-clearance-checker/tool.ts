import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualPassageClearWidthMeters: number;
  readonly actualStretcherEnvelopeWidthMeters: number;
  readonly callerQualifiedRequiredLateralMarginMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPassageClearWidthMeters",
    label: "Actual passage clear width meters",
    kind: "number",
  },
  {
    id: "actualStretcherEnvelopeWidthMeters",
    label: "Actual stretcher envelope width meters",
    kind: "number",
  },
  {
    id: "callerQualifiedRequiredLateralMarginMeters",
    label: "Caller qualified required lateral margin meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualPassageClearWidthMeters, "width");
  positive(input.actualStretcherEnvelopeWidthMeters, "envelope");
  nonnegative(input.callerQualifiedRequiredLateralMarginMeters, "margin");
  const c =
    input.actualPassageClearWidthMeters -
    input.actualStretcherEnvelopeWidthMeters;
  return {
    signedWidthClearanceMeters: c,
    signedClearanceMinusCallerMarginMeters:
      c - input.callerQualifiedRequiredLateralMarginMeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPassageClearWidthMeters: 1,
    actualStretcherEnvelopeWidthMeters: 0.8,
    callerQualifiedRequiredLateralMarginMeters: 0.1,
  },
  output: {
    result: {
      signedWidthClearanceMeters: 0.2,
      signedClearanceMinusCallerMarginMeters: 0.1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/stretcher-clearance-checker",
  title: "Stretcher Clearance in Narrow Passage Checker",
  description:
    "Actual straight lateral envelope clearance only versus qualified caller margin. Turns, vertical clearance, patient/restraints, rescuers and actual transport safety external; not passage traversal approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
