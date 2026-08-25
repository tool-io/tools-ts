import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type OechsleToBrixInput = {
  readonly oechsle: number;
};

export type OechsleToBrixOutput = {
  readonly brix: number;
};

export const oechsleToBrixExample = {
  input: {
    oechsle: 83,
  },
  output: {
    brix: 20.003490931,
  },
} satisfies ToolExample<OechsleToBrixInput, OechsleToBrixOutput>;

export const calculateOechsleToBrix = (
  input: OechsleToBrixInput,
): OechsleToBrixOutput => {
  const specificGravity = 1 + input.oechsle / 1000;
  if (specificGravity <= 0)
    simpleError(
      "oechsle",
      "The Oechsle value is below the measurable density range.",
      "invalid_value",
    );
  const densityDelta = specificGravity - 1;
  return {
    brix: roundStatistic(
      (densityDelta * 258.6) / (1 + (densityDelta * 227.1) / 258.2),
    ),
  };
};

export const oechsleToBrixTool = createSimpleTool({
  calculate: (input) =>
    calculateOechsleToBrix(input as unknown as OechsleToBrixInput),
  description:
    "Convert German Oechsle degrees to approximate degrees Brix through the equivalent specific gravity.",
  id: "oenology/oechsle-to-brix",
  inputs: [
    {
      description:
        "Must weight in Oechsle degrees; 83 Oe equals a specific gravity of 1.083.",
      id: "oechsle",
      kind: "number",
      label: "Oechsle",
      minimum: 0,
      unit: "°Oe",
    },
  ],
  outputs: [
    {
      description: "Approximate dissolved sugar in degrees Brix.",
      id: "brix",
      kind: "number",
      label: "Brix",
      unit: "°Bx",
    },
  ],
  title: "Oechsle to Brix Converter",
});
export const runOechsleToBrix = oechsleToBrixTool.execute;
export default oechsleToBrixTool;
