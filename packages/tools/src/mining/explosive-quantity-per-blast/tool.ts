import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualRetrospectivelyReconciledPerHoleConsumptionKg: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRetrospectivelyReconciledPerHoleConsumptionKg",
    label: "Actual retrospectively reconciled per hole consumption kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualRetrospectivelyReconciledPerHoleConsumptionKg.length)
    simpleError(
      "actualRetrospectivelyReconciledPerHoleConsumptionKg",
      "Actual nonempty observations.",
    );
  input.actualRetrospectivelyReconciledPerHoleConsumptionKg.forEach((v) =>
    nonnegative(v, "actualRetrospectivelyReconciledPerHoleConsumptionKg"),
  );
  return {
    value: sum(input.actualRetrospectivelyReconciledPerHoleConsumptionKg),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualRetrospectivelyReconciledPerHoleConsumptionKg: [1, 2] },
  output: { result: { value: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/explosive-quantity-per-blast",
  title: "Explosive Quantity Per Blast Calculator",
  description:
    "Retrospective audited site blast event mass ledger total already recorded per hole consumptions, no calculate/set explosive quantities from hole geometry, rock volume or powder factor; no instructions or safety approval.",
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
