import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MagneticAnomalyTotalFieldInput = {
  readonly observedTotalFieldNt: number;
  readonly regionalFieldNt: number;
};

export type MagneticAnomalyTotalFieldOutput = {
  readonly totalFieldAnomalyNt: number;
};

export const calculateMagneticAnomalyTotalField = (
  input: MagneticAnomalyTotalFieldInput,
): MagneticAnomalyTotalFieldOutput => {
  if (!(input.observedTotalFieldNt > 0))
    return simpleError(
      "observedTotalFieldNt",
      "Observed total field magnitude must be greater than zero.",
      "invalid_field",
    );
  if (!(input.regionalFieldNt > 0))
    return simpleError(
      "regionalFieldNt",
      "Regional (main) field magnitude must be greater than zero.",
      "invalid_field",
    );
  return {
    totalFieldAnomalyNt: input.observedTotalFieldNt - input.regionalFieldNt,
  };
};

export const magneticAnomalyTotalFieldExample = {
  input: { observedTotalFieldNt: 51234.5, regionalFieldNt: 48750.2 },
  output: { totalFieldAnomalyNt: 2484.300000000003 },
} satisfies ToolExample<
  MagneticAnomalyTotalFieldInput,
  MagneticAnomalyTotalFieldOutput
>;

export const magneticAnomalyTotalFieldTool = createSimpleTool({
  id: "geology/magnetic-anomaly-total-field",
  title: "Magnetic Anomaly Total Field Calculator",
  description:
    "Total-field magnetic anomaly in nanotesla: the difference between the observed total-field magnitude and the regional (main-field) magnitude at the same location.",
  inputs: [
    {
      description:
        "Measured total-field magnitude at the station in nanotesla.",
      id: "observedTotalFieldNt",
      kind: "number",
      label: "T obs",
      minimum: 0,
    },
    {
      description:
        "Regional (IGRF/main-field) magnitude at the station in nanotesla.",
      id: "regionalFieldNt",
      kind: "number",
      label: "T reg",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Total-field anomaly in nanotesla.",
      id: "totalFieldAnomalyNt",
      kind: "number",
      label: "Delta T",
    },
  ],
  calculate: (input) =>
    calculateMagneticAnomalyTotalField(
      input as unknown as MagneticAnomalyTotalFieldInput,
    ),
});

export const runMagneticAnomalyTotalField =
  magneticAnomalyTotalFieldTool.execute;
export default magneticAnomalyTotalFieldTool;
