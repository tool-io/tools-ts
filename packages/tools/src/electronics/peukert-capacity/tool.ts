import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PeukertCapacityInput = {
  readonly dischargeCurrentAmps: number;
  readonly peukertExponent?: number;
  readonly ratedCapacityAh: number;
  readonly ratedDischargeRateAmps: number;
};

export type PeukertCapacityOutput = {
  readonly effectiveRuntimeHours: number;
};

export const peukertCapacityExample = {
  input: {
    dischargeCurrentAmps: 20,
    ratedCapacityAh: 100,
    ratedDischargeRateAmps: 10,
  },
  output: { effectiveRuntimeHours: 43.527528164806206 },
} satisfies ToolExample<PeukertCapacityInput, PeukertCapacityOutput>;

export const calculatePeukertCapacity = (
  input: PeukertCapacityInput,
): PeukertCapacityOutput => {
  if (!(input.ratedCapacityAh > 0))
    simpleError(
      "ratedCapacityAh",
      "Rated capacity must be positive.",
      "invalid_capacity",
    );
  if (!(input.ratedDischargeRateAmps > 0))
    simpleError(
      "ratedDischargeRateAmps",
      "Rated discharge rate must be positive.",
      "invalid_capacity",
    );
  if (!(input.dischargeCurrentAmps > 0))
    simpleError(
      "dischargeCurrentAmps",
      "Discharge current must be positive.",
      "invalid_current",
    );
  const exponent = input.peukertExponent ?? 1.2;
  if (!(exponent >= 1) || !(exponent <= 1.6))
    simpleError(
      "peukertExponent",
      "Peukert exponent must be between one and 1.6.",
      "invalid_exponent",
    );
  return {
    effectiveRuntimeHours:
      input.ratedCapacityAh *
      Math.pow(
        input.ratedDischargeRateAmps / input.dischargeCurrentAmps,
        exponent,
      ),
  };
};

export const peukertCapacityTool = createSimpleTool({
  calculate: (input) =>
    calculatePeukertCapacity(input as unknown as PeukertCapacityInput),
  description:
    "Estimate effective battery runtime under Peukert's law for a given discharge current.",
  id: "electronics/peukert-capacity",
  inputs: [
    {
      description: "Rated capacity at the reference discharge rate.",
      format: "capacity",
      id: "ratedCapacityAh",
      kind: "number",
      label: "Rated capacity",
      unit: "Ah",
    },
    {
      description: "Discharge rate at which the rated capacity is quoted.",
      format: "current",
      id: "ratedDischargeRateAmps",
      kind: "number",
      label: "Rated discharge rate",
      unit: "A",
    },
    {
      description: "Actual discharge current drawn from the battery.",
      format: "current",
      id: "dischargeCurrentAmps",
      kind: "number",
      label: "Discharge current",
      unit: "A",
    },
    {
      default: 1.2,
      description: "Peukert exponent capturing rate-dependent losses.",
      id: "peukertExponent",
      kind: "number",
      label: "Peukert exponent",
      maximum: 1.6,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Estimated runtime at the given discharge current.",
      format: "duration",
      id: "effectiveRuntimeHours",
      kind: "number",
      label: "Effective runtime",
      unit: "h",
    },
  ],
  title: "Peukert Capacity",
});
export const runPeukertCapacity = peukertCapacityTool.execute;
export default peukertCapacityTool;
