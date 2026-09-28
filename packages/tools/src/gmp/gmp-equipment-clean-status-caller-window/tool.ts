import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly status: string;
  readonly cleanedAt: number;
  readonly useAt: number;
  readonly validFor: number;
  readonly released: boolean;
};
export type Output = {
  readonly elapsed: number;
  readonly insideWindow: boolean;
  readonly recordEligible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    status: {
      type: "string",
      maxLength: 8192,
      enum: ["clean", "dirty", "unknown"],
    },
    cleanedAt: { type: "number" },
    useAt: { type: "number" },
    validFor: { type: "number", minimum: 0 },
    released: { type: "boolean" },
  },
  required: ["status", "cleanedAt", "useAt", "validFor", "released"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    insideWindow: { type: "boolean" },
    recordEligible: { type: "boolean" },
  },
  required: ["elapsed", "insideWindow", "recordEligible"],
} as const;
/** Audit supplied status and elapsed-time records under an explicit cleaning window. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { status, cleanedAt, useAt, validFor, released } = request;
  const compute = (): Output => {
    H.domain(["clean", "dirty", "unknown"].includes(status), "status");
    H.domain(validFor >= 0 && useAt >= cleanedAt);
    const elapsed = useAt - cleanedAt,
      insideWindow = elapsed <= validFor;
    return {
      elapsed,
      insideWindow,
      recordEligible: status === "clean" && released && insideWindow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    status: "clean",
    cleanedAt: 100,
    useAt: 110,
    validFor: 15,
    released: true,
  },
  output: { elapsed: 10, insideWindow: true, recordEligible: true },
} satisfies ToolExample<Input, Output>;
export const gmpEquipmentCleanStatusCallerWindowTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gmp/gmp-equipment-clean-status-caller-window",
      title: "GMP Equipment Clean Status Caller Window Tool",
      description:
        "Audit supplied status and elapsed-time records under an explicit cleaning window.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          status: {
            type: "string",
            maxLength: 8192,
            enum: ["clean", "dirty", "unknown"],
          },
          cleanedAt: { type: "number" },
          useAt: { type: "number" },
          validFor: { type: "number", minimum: 0 },
          released: { type: "boolean" },
        },
        required: ["status", "cleanedAt", "useAt", "validFor", "released"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elapsed: { type: "number" },
          insideWindow: { type: "boolean" },
          recordEligible: { type: "boolean" },
        },
        required: ["elapsed", "insideWindow", "recordEligible"],
      },
      ports: {
        inputs: [
          {
            id: "status",
            label: "Status",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "cleanedAt",
            label: "Cleaned At",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "useAt",
            label: "Use At",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "validFor",
            label: "Valid For",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "released",
            label: "Released",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
          {
            id: "insideWindow",
            label: "Inside Window",
            valueType: { type: "boolean" },
          },
          {
            id: "recordEligible",
            label: "Record Eligible",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = gmpEquipmentCleanStatusCallerWindowTool.execute;
export default gmpEquipmentCleanStatusCallerWindowTool;
