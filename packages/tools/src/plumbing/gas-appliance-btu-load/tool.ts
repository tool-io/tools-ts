import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
  unique,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerApplianceIds: readonly string[];
  readonly callerVerifiedApplianceInputBtuHour: readonly number[];
  readonly callerSimultaneousDutyFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerCoincidentGasInputBtuHour: number;
  readonly totalNameplateGasInputBtuHour: number;
}>;
const inputFields = [
  {
    id: "callerApplianceIds",
    label: "Caller appliance ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedApplianceInputBtuHour",
    label: "Caller verified appliance input btu hour",
    kind: "numberList",
  },
  {
    id: "callerSimultaneousDutyFractions",
    label: "Caller simultaneous duty fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedApplianceInputBtuHour.forEach((v) =>
    nonnegative(v, "callerVerifiedApplianceInputBtuHour"),
  );
  input.callerSimultaneousDutyFractions.forEach((v) =>
    fraction(v, "callerSimultaneousDutyFractions"),
  );
  aligned(
    input.callerApplianceIds,
    input.callerVerifiedApplianceInputBtuHour,
    "callerApplianceIds",
  );
  aligned(
    input.callerApplianceIds,
    input.callerSimultaneousDutyFractions,
    "callerApplianceIds",
  );
  unique(input.callerApplianceIds, "appliances");
  return {
    callerCoincidentGasInputBtuHour: sum(
      input.callerVerifiedApplianceInputBtuHour.map(
        (v, i) => v * input.callerSimultaneousDutyFractions[i],
      ),
    ),
    totalNameplateGasInputBtuHour: sum(
      input.callerVerifiedApplianceInputBtuHour,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerApplianceIds: ["a", "b"],
  callerVerifiedApplianceInputBtuHour: [10000, 20000],
  callerSimultaneousDutyFractions: [1, 0.5],
} satisfies Input;
export const exampleOutput = {
  callerCoincidentGasInputBtuHour: 20000,
  totalNameplateGasInputBtuHour: 30000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/gas-appliance-btu-load",
  title: "Plumbing Gas Appliance Btu Load Calculator",
  description:
    "Inventory caller actual appliance nameplate INPUT and explicit coincident duty scenario; not useful output, heating load estimation, pipe capacity or burner instructions.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCoincidentGasInputBtuHour",
      label: "Caller coincident gas input btu hour",
      kind: "number",
    },
    {
      id: "totalNameplateGasInputBtuHour",
      label: "Total nameplate gas input btu hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerApplianceIds: value.callerApplianceIds as readonly string[],
      callerVerifiedApplianceInputBtuHour:
        value.callerVerifiedApplianceInputBtuHour as readonly number[],
      callerSimultaneousDutyFractions:
        value.callerSimultaneousDutyFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
