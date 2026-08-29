import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OpampInputBiasCurrentInput = Readonly<{
  readonly noninvertingInputCurrentAmperes: number;
  readonly invertingInputCurrentAmperes: number;
}>;
export type OpampInputBiasCurrentOutput = Readonly<{
  inputBiasCurrentAmperes: number;
}>;

export const calculateOpampInputBiasCurrent = (
  i: OpampInputBiasCurrentInput,
): OpampInputBiasCurrentOutput => {
  const value =
    (Math.abs(i.noninvertingInputCurrentAmperes) +
      Math.abs(i.invertingInputCurrentAmperes)) /
    2;
  if (!Number.isFinite(value))
    simpleError(
      "inputBiasCurrentAmperes",
      "The inputs produce a non-finite result.",
    );
  return { inputBiasCurrentAmperes: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    noninvertingInputCurrentAmperes: 2e-8,
    invertingInputCurrentAmperes: 2.4e-8,
  },
  output: { inputBiasCurrentAmperes: 2.2e-8 },
} satisfies ToolExample<
  OpampInputBiasCurrentInput,
  OpampInputBiasCurrentOutput
>;

export const tool = createSimpleTool({
  id: "electronics/opamp-input-bias-current",
  title: "Opamp Input Bias Current",
  description:
    "Calculate average op-amp input bias-current magnitude as half the sum of the magnitudes of the two input currents.",
  inputs: [
    {
      id: "noninvertingInputCurrentAmperes",
      kind: "number",
      label: "Noninverting Input Current (A)",
      unit: "A",
    },
    {
      id: "invertingInputCurrentAmperes",
      kind: "number",
      label: "Inverting Input Current (A)",
      unit: "A",
    },
  ],
  outputs: [
    {
      id: "inputBiasCurrentAmperes",
      kind: "number",
      label: "Input Bias Current (A)",
      unit: "A",
    },
  ],
  calculate: (input) =>
    calculateOpampInputBiasCurrent({
      noninvertingInputCurrentAmperes:
        input.noninvertingInputCurrentAmperes as number,
      invertingInputCurrentAmperes:
        input.invertingInputCurrentAmperes as number,
    }),
});
export const opampInputBiasCurrentTool = tool;
export const runOpampInputBiasCurrent = tool.execute;
export default tool;
