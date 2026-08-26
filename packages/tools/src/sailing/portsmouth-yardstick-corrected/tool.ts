import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PortsmouthYardstickCorrectedInput = {
  readonly elapsedSeconds: number;
  readonly pyNumber: number;
};

export type PortsmouthYardstickCorrectedOutput = {
  readonly correctedTimeSeconds: number;
};

export const portsmouthYardstickCorrectedExample = {
  input: { elapsedSeconds: 3600, pyNumber: 120 },
  output: { correctedTimeSeconds: 3000 },
} satisfies ToolExample<
  PortsmouthYardstickCorrectedInput,
  PortsmouthYardstickCorrectedOutput
>;

export const portsmouthYardstickCorrectedTool = createSimpleTool({
  calculate: (input) => {
    const elapsedSeconds = input.elapsedSeconds as number;
    const pyNumber = input.pyNumber as number;
    if (elapsedSeconds <= 0)
      simpleError(
        "elapsedSeconds",
        "Elapsed time must be positive.",
        "invalid_input",
      );
    if (pyNumber <= 0)
      simpleError(
        "pyNumber",
        "Portsmouth Number must be positive.",
        "invalid_input",
      );
    return { correctedTimeSeconds: (elapsedSeconds * 100) / pyNumber };
  },
  description:
    "Calculate a Portsmouth Yardstick corrected race time using correctedTimeSeconds = elapsedSeconds * 100 / pyNumber.",
  id: "sailing/portsmouth-yardstick-corrected",
  inputs: [
    {
      description: "Elapsed race time in seconds.",
      id: "elapsedSeconds",
      kind: "number",
      label: "Elapsed time",
      unit: "s",
    },
    {
      description:
        "Portsmouth Number yardstick for the class, typically between 60 and 160.",
      id: "pyNumber",
      kind: "number",
      label: "Portsmouth Number",
    },
  ],
  outputs: [
    {
      description: "Handicap corrected time in seconds.",
      id: "correctedTimeSeconds",
      kind: "number",
      label: "Corrected time",
      unit: "s",
    },
  ],
  title: "Portsmouth Yardstick Corrected Time Calculator",
});
export const runPortsmouthYardstickCorrected =
  portsmouthYardstickCorrectedTool.execute;
export default portsmouthYardstickCorrectedTool;
