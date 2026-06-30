import { defineTool } from "../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../core/result.js";
import {
  compareBedSizes,
  isBedSizeOutput,
  type BedSizeInput,
  type BedSizeOutput,
} from "./bed/tool.js";
import {
  measurementSizeConfigs,
  recommendMeasurementSize,
  type MeasurementSizeInput,
  type MeasurementSizeKind,
  type MeasurementSizeOutput,
} from './measurements/tool.js';
import {
  compareShoeSizes,
  isShoeSizeOutput,
  type ShoeSizeInput,
  type ShoeSizeOutput,
} from "./shoe/tool.js";

const supportedSizeItems = ['bed', ...Object.keys(measurementSizeConfigs), 'shoe'];

export type SizeToolInput =
  | (BedSizeInput & { readonly item: "bed" })
  | (MeasurementSizeInput & { readonly item: MeasurementSizeKind })
  | (ShoeSizeInput & { readonly item: "shoe" });

export type SizeToolOutput =
  | (BedSizeOutput & { readonly item: "bed" })
  | (MeasurementSizeOutput & { readonly item: MeasurementSizeKind })
  | (ShoeSizeOutput & { readonly item: "shoe" });

export const compareSizes = (input: unknown): ToolResult<SizeToolOutput> => {
  if (typeof input !== "object" || input === null || Array.isArray(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const record = input as Record<string, unknown>;
  if (record.item === "bed") {
    const result = compareBedSizes({ market: record.market, size: record.size });
    return result.ok ? toolSuccess({ item: "bed", ...result.output }) : result;
  }
  if (typeof record.item === 'string' && record.item in measurementSizeConfigs) {
    const item = record.item as MeasurementSizeKind;
    const result = recommendMeasurementSize(item, { unit: record.unit, values: record.values });
    return result.ok ? toolSuccess({ item, ...result.output }) : result;
  }
  if (record.item !== "shoe")
    return invalidInput([
      {
        code: "unsupported_item",
        field: "item",
        message: "The requested size tool is not supported.",
      },
    ]);
  const result = compareShoeSizes({
    profile: record.profile,
    size: record.size,
    system: record.system,
  });
  return result.ok ? toolSuccess({ item: "shoe", ...result.output }) : result;
};

export const sizeTool = defineTool<SizeToolInput, SizeToolOutput>({
  contractVersion: 1,
  description:
    "Dispatch to an independently importable Tool.io size comparison tool.",
  execute: compareSizes,
  execution: { kind: "pure" },
  id: "size",
  inputSchema: {
    additionalProperties: false,
    properties: {
      item: { enum: supportedSizeItems, type: "string" },
      market: { enum: ["au", "eu", "jp", "uk", "us"], type: "string" },
      profile: { enum: ["women", "men", "children"], type: "string" },
      size: { anyOf: [{ type: "number" }, { type: "string" }] },
      system: {
        enum: ["mondopoint", "eu", "uk", "us", "jp", "cn", "kr"],
        type: "string",
      },
      unit: { enum: ['cm', 'in'], type: 'string' },
      values: { additionalProperties: true, type: 'object' },
    },
    required: ["item"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: true,
    properties: { item: { enum: supportedSizeItems, type: "string" } },
    required: ["item"],
    type: "object",
  },
  ports: {
    inputs: [
      { id: "item", label: "Size category", required: true, valueType: { format: "size-category", type: "string" } },
    ],
    outputs: [
      { id: "item", label: "Size category", valueType: { format: "size-category", type: "string" } },
    ],
  },
  title: "Size Comparison",
});

export default sizeTool;
