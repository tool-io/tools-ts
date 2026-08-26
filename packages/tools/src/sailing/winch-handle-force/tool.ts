import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WinchHandleForceInput = {
  readonly loadNewtons: number;
  readonly powerRatio: number;
};

export type WinchHandleForceOutput = {
  readonly handleForceNewtons: number;
};

export const winchHandleForceExample = {
  input: { loadNewtons: 800, powerRatio: 16 },
  output: { handleForceNewtons: 50 },
} satisfies ToolExample<WinchHandleForceInput, WinchHandleForceOutput>;

export const calculateWinchHandleForce = (
  input: WinchHandleForceInput,
): WinchHandleForceOutput => {
  if (input.loadNewtons <= 0)
    simpleError(
      "loadNewtons",
      "The sheet load must be positive.",
      "invalid_input",
    );
  if (input.powerRatio <= 0)
    simpleError(
      "powerRatio",
      "The power ratio must be positive.",
      "invalid_input",
    );
  return {
    handleForceNewtons: input.loadNewtons / input.powerRatio,
  };
};

export const winchHandleForceTool = createSimpleTool({
  calculate: (input) =>
    calculateWinchHandleForce(input as unknown as WinchHandleForceInput),
  description:
    "Compute the handle force needed to trim a load as the load divided by the winch power ratio.",
  id: "sailing/winch-handle-force",
  inputs: [
    {
      description: "Tension on the tail side that the winch must hold.",
      format: "force",
      id: "loadNewtons",
      kind: "number",
      label: "Load",
      unit: "N",
    },
    {
      description:
        "Mechanical advantage of the winch, handle length times gear teeth over drum circumference.",
      format: "ratio",
      id: "powerRatio",
      kind: "number",
      label: "Power ratio",
    },
  ],
  outputs: [
    {
      description: "Force applied at the winch handle.",
      format: "force",
      id: "handleForceNewtons",
      kind: "number",
      label: "Handle force",
      unit: "N",
    },
  ],
  title: "Winch Handle Force Calculator",
});
export const runWinchHandleForce = winchHandleForceTool.execute;
export default winchHandleForceTool;
