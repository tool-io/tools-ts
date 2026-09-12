import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredUnboundPhenytoinConcentration: number;
  readonly actualMeasuredTotalPhenytoinConcentration: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredUnboundPhenytoinConcentration",
    label: "Actual measured unbound phenytoin concentration",
    kind: "number",
  },
  {
    id: "actualMeasuredTotalPhenytoinConcentration",
    label: "Actual measured total phenytoin concentration",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualMeasuredUnboundPhenytoinConcentration,
    "actualMeasuredUnboundPhenytoinConcentration",
  );
  positive(
    input.actualMeasuredTotalPhenytoinConcentration,
    "actualMeasuredTotalPhenytoinConcentration",
  );
  if (
    input.actualMeasuredUnboundPhenytoinConcentration >
    input.actualMeasuredTotalPhenytoinConcentration
  )
    simpleError("concentrations", "Actualsamepoolfree≤total.");
  return {
    value:
      input.actualMeasuredUnboundPhenytoinConcentration /
      input.actualMeasuredTotalPhenytoinConcentration,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMeasuredUnboundPhenytoinConcentration: 1,
    actualMeasuredTotalPhenytoinConcentration: 10,
  },
  output: { result: { value: 0.1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/phenytoin-free-fraction-renal",
  title: "Phenytoin Free Fraction Renal Calculator",
  description:
    "Actual independently measured free/total phenytoin fraction under matched assay/state, not albumin corrected proxy or estimate from renal functional one. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
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
