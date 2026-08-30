import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly lowReceivingFlowM3PerSecond: number;
  readonly receivingConcentrationMgPerLiter: number;
  readonly effluentConcentrationMgPerLiter: number;
  readonly targetMixedConcentrationMgPerLiter: number;
  readonly proposedEffluentFlowM3PerSecond: number;
}>;
export type Output = Readonly<{
  readonly maximumModelEffluentFlowM3PerSecond: number;
  readonly flowMarginM3PerSecond: number;
  readonly completeMixConcentrationMgPerLiter: number;
}>;
const inputFields = [
  {
    id: "lowReceivingFlowM3PerSecond",
    label: "Low receiving flow m3 per second",
    kind: "number",
  },
  {
    id: "receivingConcentrationMgPerLiter",
    label: "Receiving concentration mg per liter",
    kind: "number",
  },
  {
    id: "effluentConcentrationMgPerLiter",
    label: "Effluent concentration mg per liter",
    kind: "number",
  },
  {
    id: "targetMixedConcentrationMgPerLiter",
    label: "Target mixed concentration mg per liter",
    kind: "number",
  },
  {
    id: "proposedEffluentFlowM3PerSecond",
    label: "Proposed effluent flow m3 per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.lowReceivingFlowM3PerSecond, "lowReceivingFlowM3PerSecond");
  nonnegative(
    input.receivingConcentrationMgPerLiter,
    "receivingConcentrationMgPerLiter",
  );
  nonnegative(
    input.effluentConcentrationMgPerLiter,
    "effluentConcentrationMgPerLiter",
  );
  nonnegative(
    input.targetMixedConcentrationMgPerLiter,
    "targetMixedConcentrationMgPerLiter",
  );
  nonnegative(
    input.proposedEffluentFlowM3PerSecond,
    "proposedEffluentFlowM3PerSecond",
  );
  const a = positive(
      input.targetMixedConcentrationMgPerLiter -
        input.receivingConcentrationMgPerLiter,
      "targetMixedConcentrationMgPerLiter",
    ),
    b = positive(
      input.effluentConcentrationMgPerLiter -
        input.targetMixedConcentrationMgPerLiter,
      "effluentConcentrationMgPerLiter",
    ),
    maximumModelEffluentFlowM3PerSecond =
      (input.lowReceivingFlowM3PerSecond * a) / b;
  return {
    maximumModelEffluentFlowM3PerSecond,
    flowMarginM3PerSecond:
      maximumModelEffluentFlowM3PerSecond -
      input.proposedEffluentFlowM3PerSecond,
    completeMixConcentrationMgPerLiter:
      (input.lowReceivingFlowM3PerSecond *
        input.receivingConcentrationMgPerLiter +
        input.proposedEffluentFlowM3PerSecond *
          input.effluentConcentrationMgPerLiter) /
      (input.lowReceivingFlowM3PerSecond +
        input.proposedEffluentFlowM3PerSecond),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lowReceivingFlowM3PerSecond: 10,
  receivingConcentrationMgPerLiter: 1,
  effluentConcentrationMgPerLiter: 11,
  targetMixedConcentrationMgPerLiter: 3,
  proposedEffluentFlowM3PerSecond: 2,
} satisfies Input;
export const exampleOutput = {
  maximumModelEffluentFlowM3PerSecond: 2.5,
  flowMarginM3PerSecond: 0.5,
  completeMixConcentrationMgPerLiter: 2.6666666666666665,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/dilution-capacity-low-flow",
  title: "Dilution Capacity Low Flow",
  description:
    "Invert ideal complete mixing for an effluent flow capacity when receiving concentration < target < effluent; not a legal discharge allowance, mixing-zone model or ecological guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "maximumModelEffluentFlowM3PerSecond",
      label: "Maximum model effluent flow m3 per second",
      kind: "number",
    },
    {
      id: "flowMarginM3PerSecond",
      label: "Flow margin m3 per second",
      kind: "number",
    },
    {
      id: "completeMixConcentrationMgPerLiter",
      label: "Complete mix concentration mg per liter",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      lowReceivingFlowM3PerSecond: value.lowReceivingFlowM3PerSecond as number,
      receivingConcentrationMgPerLiter:
        value.receivingConcentrationMgPerLiter as number,
      effluentConcentrationMgPerLiter:
        value.effluentConcentrationMgPerLiter as number,
      targetMixedConcentrationMgPerLiter:
        value.targetMixedConcentrationMgPerLiter as number,
      proposedEffluentFlowM3PerSecond:
        value.proposedEffluentFlowM3PerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
