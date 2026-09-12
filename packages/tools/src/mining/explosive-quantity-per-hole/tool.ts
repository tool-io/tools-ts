import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualRecordedPreHoleExplosiveInventoryKg: number;
  readonly actualRecordedPostHoleExplosiveInventoryKg: number;
  readonly actualSeparatelyRecordedReturnedMassKg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRecordedPreHoleExplosiveInventoryKg",
    label: "Actual recorded pre hole explosive inventory kg",
    kind: "number",
  },
  {
    id: "actualRecordedPostHoleExplosiveInventoryKg",
    label: "Actual recorded post hole explosive inventory kg",
    kind: "number",
  },
  {
    id: "actualSeparatelyRecordedReturnedMassKg",
    label: "Actual separately recorded returned mass kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.actualRecordedPreHoleExplosiveInventoryKg,
    input.actualRecordedPostHoleExplosiveInventoryKg,
    input.actualSeparatelyRecordedReturnedMassKg,
  ].forEach((v) => nonnegative(v, "recordedmass"));
  return {
    signedInventoryReconciledHoleConsumptionKg:
      input.actualRecordedPreHoleExplosiveInventoryKg -
      input.actualRecordedPostHoleExplosiveInventoryKg -
      input.actualSeparatelyRecordedReturnedMassKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRecordedPreHoleExplosiveInventoryKg: 10,
    actualRecordedPostHoleExplosiveInventoryKg: 8,
    actualSeparatelyRecordedReturnedMassKg: 1,
  },
  output: { result: { signedInventoryReconciledHoleConsumptionKg: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/explosive-quantity-per-hole",
  title: "Explosive Quantity Per Hole Calculator",
  description:
    "Retrospective actual single-hole inventory reconciliation only, returns separate/signed mismatch retained. No volumetric charge calculation, explosive preparation, loading recipe, detonationscheduling or site safety approval.",
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
