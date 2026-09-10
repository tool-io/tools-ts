import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualCatchmentAreaSquareMeters: number;
  readonly actualEventRainfallMeters: number;
  readonly callerIndependentRunoffFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCatchmentAreaSquareMeters",
    label: "Actual catchment area square meters",
    kind: "number",
  },
  {
    id: "actualEventRainfallMeters",
    label: "Actual event rainfall meters",
    kind: "number",
  },
  {
    id: "callerIndependentRunoffFraction",
    label: "Caller independent runoff fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualCatchmentAreaSquareMeters, "area");
  nonnegative(input.actualEventRainfallMeters, "rain");
  fraction(input.callerIndependentRunoffFraction, "runoff");
  return {
    conditionalEventRunoffCapturedCubicMeters:
      input.actualCatchmentAreaSquareMeters *
      input.actualEventRainfallMeters *
      input.callerIndependentRunoffFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCatchmentAreaSquareMeters: 10,
    actualEventRainfallMeters: 0.2,
    callerIndependentRunoffFraction: 0.5,
  },
  output: { result: { conditionalEventRunoffCapturedCubicMeters: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/sinkhole-runoff-capture",
  title: "Sinkhole Catchment Area Runoff Capture Calculator",
  description:
    "Simple actual catchment\u00d7event rain\u00d7independently validated runoff fraction captured volume. Storage/overflow/routing and recharge independently assessed; not flood-safety or total annual catchment.",
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
