import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlowRateQuantity = "mass" | "volume";
export type FlowRateUnit =
  | "L/min"
  | "L/s"
  | "ft3/s"
  | "g/s"
  | "kg/h"
  | "kg/min"
  | "kg/s"
  | "lb/min"
  | "lb/s"
  | "m3/h"
  | "m3/s"
  | "US gal/min";

export type ConvertFlowRateInput = {
  readonly fromUnit: FlowRateUnit;
  readonly quantity: FlowRateQuantity;
  readonly toUnit: FlowRateUnit;
  readonly value: number;
};

export type ConvertFlowRateOutput = {
  readonly quantity: FlowRateQuantity;
  readonly unit: FlowRateUnit;
  readonly value: number;
};

const factors: Readonly<
  Record<FlowRateQuantity, Partial<Record<FlowRateUnit, number>>>
> = {
  mass: {
    "g/s": 0.001,
    "kg/h": 1 / 3_600,
    "kg/min": 1 / 60,
    "kg/s": 1,
    "lb/min": 0.45359237 / 60,
    "lb/s": 0.45359237,
  },
  volume: {
    "L/min": 0.001 / 60,
    "L/s": 0.001,
    "US gal/min": 0.003785411784 / 60,
    "ft3/s": 0.028316846592,
    "m3/h": 1 / 3_600,
    "m3/s": 1,
  },
};

export const convertFlowRate = (
  input: ConvertFlowRateInput,
): ConvertFlowRateOutput => {
  const fromFactor =
    factors[input.quantity][input.fromUnit] ??
    simpleError(
      "fromUnit",
      "The source unit must belong to the selected flow-rate quantity.",
      "flow_quantity_mismatch",
    );
  const toFactor =
    factors[input.quantity][input.toUnit] ??
    simpleError(
      "toUnit",
      "The target unit must belong to the selected flow-rate quantity.",
      "flow_quantity_mismatch",
    );
  const value = (input.value * fromFactor) / toFactor;
  if (!Number.isFinite(value))
    simpleError(
      "value",
      "The converted value is outside the supported numeric range.",
      "result_not_finite",
    );
  return { quantity: input.quantity, unit: input.toUnit, value };
};

export const flowRateExample = {
  input: {
    fromUnit: "L/min" as const,
    quantity: "volume" as const,
    toUnit: "m3/s" as const,
    value: 60,
  },
  output: { quantity: "volume" as const, unit: "m3/s" as const, value: 0.001 },
} satisfies ToolExample<ConvertFlowRateInput, ConvertFlowRateOutput>;

const units = [
  "m3/s",
  "m3/h",
  "L/s",
  "L/min",
  "US gal/min",
  "ft3/s",
  "kg/s",
  "kg/min",
  "kg/h",
  "g/s",
  "lb/s",
  "lb/min",
] as const;

export const flowRateTool = createSimpleTool({
  calculate: (input) =>
    convertFlowRate({
      fromUnit: input.fromUnit as FlowRateUnit,
      quantity: input.quantity as FlowRateQuantity,
      toUnit: input.toUnit as FlowRateUnit,
      value: input.value as number,
    }),
  description:
    "Convert within volumetric-flow or mass-flow units without assuming a material density or conflating the two quantities.",
  id: "convert/flow-rate",
  inputs: [
    { id: "value", kind: "number", label: "Value" },
    {
      enum: ["volume", "mass"],
      id: "quantity",
      kind: "string",
      label: "Flow-rate quantity",
    },
    { enum: units, id: "fromUnit", kind: "string", label: "From unit" },
    { enum: units, id: "toUnit", kind: "string", label: "To unit" },
  ],
  outputs: [
    { id: "value", kind: "number", label: "Converted value" },
    { enum: units, id: "unit", kind: "string", label: "Unit" },
    {
      enum: ["volume", "mass"],
      id: "quantity",
      kind: "string",
      label: "Flow-rate quantity",
    },
  ],
  title: "Convert Volume or Mass Flow Rate",
});

export const runFlowRate = flowRateTool.execute;
export default flowRateTool;
