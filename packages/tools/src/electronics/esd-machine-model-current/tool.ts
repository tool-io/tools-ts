import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualInitialChargingVoltageVolts: number;
  readonly callerVerifiedMachineModelCapacitanceFarads: number;
  readonly callerVerifiedLoopInductanceHenries: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInitialChargingVoltageVolts",
    label: "Actual initial charging voltage volts",
    kind: "number",
  },
  {
    id: "callerVerifiedMachineModelCapacitanceFarads",
    label: "Caller verified machine model capacitance farads",
    kind: "number",
  },
  {
    id: "callerVerifiedLoopInductanceHenries",
    label: "Caller verified loop inductance henries",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualInitialChargingVoltageVolts,
    "actualInitialChargingVoltageVolts",
  );
  positive(
    input.callerVerifiedMachineModelCapacitanceFarads,
    "callerVerifiedMachineModelCapacitanceFarads",
  );
  positive(
    input.callerVerifiedLoopInductanceHenries,
    "callerVerifiedLoopInductanceHenries",
  );
  return {
    value:
      input.actualInitialChargingVoltageVolts *
      Math.sqrt(
        input.callerVerifiedMachineModelCapacitanceFarads /
          input.callerVerifiedLoopInductanceHenries,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualInitialChargingVoltageVolts: 2,
    callerVerifiedMachineModelCapacitanceFarads: 1,
    callerVerifiedLoopInductanceHenries: 1,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/esd-machine-model-current",
  title: "Esd Machine Model Current Calculator",
  description:
    "Loss less LC machine-model firstcurrentpeakV\u221a(C/L), not HBMV/1500ohmsor a waveform standard. Explicitly zero damping idealization; test fixture compliance external. Actual matched units/topology and independently established parameters; not a safe device/electrical design or verified manufacturer rating.",
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
