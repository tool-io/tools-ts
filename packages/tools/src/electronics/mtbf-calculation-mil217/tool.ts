import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    baseFailureRatePerHour: 0.000001,
    qualityFactor: 2,
    environmentFactor: 1.5,
    temperatureFactor: 1,
  },
  output: { failureRatePerHour: 0.000003, mtbfHours: 333333.3333333333 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/mtbf-calculation-mil217",
  title: "MIL-217-Style Parts-Count MTBF",
  description:
    "Calculate MTBF as 1/(base failure rate × product of supplied π factors) under a constant-failure-rate model. This is a transparent parts-count arithmetic aid, not a full MIL-HDBK-217 prediction because official part/environment factors are not supplied.",
  inputs: [
    {
      id: "baseFailureRatePerHour",
      kind: "number",
      label: "Base failure rate (1/h)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "qualityFactor",
      kind: "number",
      label: "Quality factor",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "environmentFactor",
      kind: "number",
      label: "Environment factor",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "temperatureFactor",
      kind: "number",
      label: "Temperature factor",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "failureRatePerHour",
      kind: "number",
      label: "Failure Rate Per Hour",
    },
    { id: "mtbfHours", kind: "number", label: "Mtbf Hours" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      failureRatePerHour:
        i.baseFailureRatePerHour *
        i.qualityFactor *
        i.environmentFactor *
        i.temperatureFactor,
      mtbfHours:
        1 /
        (i.baseFailureRatePerHour *
          i.qualityFactor *
          i.environmentFactor *
          i.temperatureFactor),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type MtbfCalculationMil217Input = Readonly<typeof example.input>;
export type MtbfCalculationMil217Output = Readonly<typeof example.output>;
export const mtbfCalculationMil217Tool = tool;
export const runMtbfCalculationMil217 = tool.execute;
export default tool;
