import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DynamicPressureInput = {
  readonly iasKt: number;
};

export type DynamicPressureOutput = {
  readonly dynamicPressurePsf: number;
};

/** ISA sea-level density in slugs per cubic foot. */
const RHO0_SLUG_FT3 = 0.0023769;
const KT_TO_FTS = 1.687809857;

export const dynamicPressureExample = {
  input: { iasKt: 100 },
  output: { dynamicPressurePsf: 33.8554 },
} satisfies ToolExample<DynamicPressureInput, DynamicPressureOutput>;

export const calculateDynamicPressure = (
  input: DynamicPressureInput,
): DynamicPressureOutput => {
  const speedFtS = input.iasKt * KT_TO_FTS;
  return {
    dynamicPressurePsf:
      Math.round(0.5 * RHO0_SLUG_FT3 * speedFtS * speedFtS * 1e6) / 1e6,
  };
};

export const dynamicPressureTool = createSimpleTool({
  calculate: (input) =>
    calculateDynamicPressure(input as unknown as DynamicPressureInput),
  description:
    "Compute the dynamic pressure from indicated airspeed at sea level density.",
  id: "aviation/dynamic-pressure",
  inputs: [
    {
      description: "Indicated airspeed.",
      id: "iasKt",
      kind: "number",
      label: "IAS",
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Dynamic pressure in pounds per square foot.",
      format: "pressure-psf",
      id: "dynamicPressurePsf",
      kind: "number",
      label: "Dynamic pressure",
      unit: "lb/ft²",
    },
  ],
  title: "Dynamic Pressure Calculator",
});
export const runDynamicPressure = dynamicPressureTool.execute;
export default dynamicPressureTool;
