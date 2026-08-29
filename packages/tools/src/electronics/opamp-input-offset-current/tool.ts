import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OpampInputOffsetCurrentInput = Readonly<{
  readonly noninvertingInputCurrentAmperes: number;
  readonly invertingInputCurrentAmperes: number;
}>;
export type OpampInputOffsetCurrentOutput = Readonly<{
  inputOffsetCurrentAmperes: number;
}>;

export const calculateOpampInputOffsetCurrent = (
  i: OpampInputOffsetCurrentInput,
): OpampInputOffsetCurrentOutput => {
  const value = Math.abs(
    i.noninvertingInputCurrentAmperes - i.invertingInputCurrentAmperes,
  );
  if (!Number.isFinite(value))
    simpleError(
      "inputOffsetCurrentAmperes",
      "The inputs produce a non-finite result.",
    );
  return { inputOffsetCurrentAmperes: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    noninvertingInputCurrentAmperes: 2e-8,
    invertingInputCurrentAmperes: 2.4e-8,
  },
  output: { inputOffsetCurrentAmperes: 3.9999999999999994e-9 },
} satisfies ToolExample<
  OpampInputOffsetCurrentInput,
  OpampInputOffsetCurrentOutput
>;

export const tool = createSimpleTool({
  id: "electronics/opamp-input-offset-current",
  title: "Opamp Input Offset Current",
  description:
    "Calculate op-amp input offset current as the absolute difference between the two input bias currents, using signed current measurements.",
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
      id: "inputOffsetCurrentAmperes",
      kind: "number",
      label: "Input Offset Current (A)",
      unit: "A",
    },
  ],
  calculate: (input) =>
    calculateOpampInputOffsetCurrent({
      noninvertingInputCurrentAmperes:
        input.noninvertingInputCurrentAmperes as number,
      invertingInputCurrentAmperes:
        input.invertingInputCurrentAmperes as number,
    }),
});
export const opampInputOffsetCurrentTool = tool;
export const runOpampInputOffsetCurrent = tool.execute;
export default tool;
