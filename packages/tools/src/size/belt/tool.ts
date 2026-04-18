import { defineTool } from "../../core/definition.js";
import {
  listTextType,
  quantityLengthCentimetersType,
  textPlainType,
  unitMeasurementType,
} from "../../core/semantic-type.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";

export type BeltSizeInput = {
  readonly unit?: "cm" | "in";
  readonly values: Readonly<{ waist: number }>;
};

export type BeltSizeOutput = {
  readonly equivalents: readonly string[];
  readonly kind: "belt";
  readonly measurementsCm: Readonly<{ waist: number }>;
  readonly primary: string;
  readonly warning: string;
};

const round = (value: number, digits = 1): number =>
  Number(value.toFixed(digits));
const nearestEven = (value: number): number => Math.round(value / 2) * 2;
const nearestFive = (value: number): number => Math.round(value / 5) * 5;

export const recommendBeltSize = (
  input: unknown,
): ToolResult<BeltSizeOutput> => {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  }

  const record = input as Record<string, unknown>;
  if (
    typeof record.values !== "object" ||
    record.values === null ||
    Array.isArray(record.values)
  ) {
    return invalidInput([
      {
        code: "values_required",
        field: "values",
        message: "Measurements must be an object.",
      },
    ]);
  }

  const waist = Number((record.values as Record<string, unknown>).waist);
  const waistCm = record.unit === "in" ? waist * 2.54 : waist;
  if (!Number.isFinite(waistCm) || waistCm < 40 || waistCm > 180) {
    return invalidInput([
      {
        code: "measurement_out_of_range",
        field: "waist",
        message: "Waist at belt position is outside the supported range.",
      },
    ]);
  }

  const europeanSize = nearestFive(waistCm);
  return toolSuccess({
    equivalents: [
      `US ${nearestEven(waistCm / 2.54 + 2)} in`,
      `Suggested center-hole length ${europeanSize} cm`,
    ],
    kind: "belt",
    measurementsCm: { waist: waistCm },
    primary: `EU ${europeanSize}`,
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  });
};

export const beltSizeTool = defineTool<BeltSizeInput, BeltSizeOutput>({
  contractVersion: 1,
  description:
    "Estimate belt labels and finished length from the waist position where the belt will be worn.",
  execute: recommendBeltSize,
  executionKind: "pure",
  id: "size/belt",
  inputSchema: {
    additionalProperties: false,
    properties: {
      unit: { enum: ["cm", "in"], type: "string" },
      values: { type: "object" },
    },
    required: ["values"],
    type: "object",
  },
  isOutput: (value): value is BeltSizeOutput =>
    typeof value === "object" &&
    value !== null &&
    (value as { kind?: unknown }).kind === "belt",
  outputSchema: {
    additionalProperties: false,
    properties: {
      equivalents: { type: "array" },
      kind: { const: "belt" },
      measurementsCm: { type: "object" },
      primary: { type: "string" },
      warning: { type: "string" },
    },
    required: ["equivalents", "kind", "measurementsCm", "primary", "warning"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "unit",
        label: "Input unit",
        type: unitMeasurementType,
      },
      {
        id: "waist",
        label: "Waist at belt position",
        path: ["values", "waist"],
        required: true,
        type: quantityLengthCentimetersType,
      },
    ],
    outputs: [
      {
        id: "waist",
        label: "Waist in centimeters",
        path: ["measurementsCm", "waist"],
        type: quantityLengthCentimetersType,
      },
      {
        id: "primary",
        label: "Recommended size",
        type: textPlainType,
      },
      {
        id: "equivalents",
        label: "Equivalent sizes",
        type: listTextType,
      },
      {
        id: "warning",
        label: "Sizing warning",
        type: textPlainType,
      },
    ],
  },
  title: "Belt Size Comparison",
});

export default beltSizeTool;
