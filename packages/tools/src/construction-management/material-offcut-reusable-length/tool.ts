import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly offcutLength: number;
  readonly damagedEndLength: number;
  readonly trimAllowance: number;
};
export type Output = {
  readonly usableLength: number;
  readonly recoverable: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offcutLength: { type: "number", minimum: 0 },
    damagedEndLength: { type: "number", minimum: 0 },
    trimAllowance: { type: "number", minimum: 0 },
  },
  required: ["offcutLength", "damagedEndLength", "trimAllowance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableLength: { type: "number" },
    recoverable: { type: "boolean" },
  },
  required: ["usableLength", "recoverable"],
} as const;
/** Subtract explicitly measured damage and trim allowances from one material offcut, reporting a nonnegative reusable length. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { offcutLength, damagedEndLength, trimAllowance } = request;
  const compute = (): Output => {
    H.domain(
      offcutLength >= 0 && damagedEndLength >= 0 && trimAllowance >= 0,
      "offcutLength",
    );
    return {
      usableLength: Math.max(
        0,
        offcutLength - damagedEndLength - trimAllowance,
      ),
      recoverable: offcutLength > damagedEndLength + trimAllowance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { offcutLength: 1200, damagedEndLength: 100, trimAllowance: 50 },
  output: { usableLength: 1050, recoverable: true },
} satisfies ToolExample<Input, Output>;
export const materialOffcutReusableLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "construction-management",
        "construction management",
        "engineering",
      ],
      keywords: ["construction management", "engineering"],
    },
    id: "construction-management/material-offcut-reusable-length",
    title: "Material Offcut Reusable Length",
    description:
      "Subtract explicitly measured damage and trim allowances from one material offcut, reporting a nonnegative reusable length.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offcutLength: { type: "number", minimum: 0 },
        damagedEndLength: { type: "number", minimum: 0 },
        trimAllowance: { type: "number", minimum: 0 },
      },
      required: ["offcutLength", "damagedEndLength", "trimAllowance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableLength: { type: "number" },
        recoverable: { type: "boolean" },
      },
      required: ["usableLength", "recoverable"],
    },
    ports: {
      inputs: [
        {
          id: "offcutLength",
          label: "Offcut Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "damagedEndLength",
          label: "Damaged End Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trimAllowance",
          label: "Trim Allowance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usableLength",
          label: "Usable Length",
          valueType: { type: "number" },
        },
        {
          id: "recoverable",
          label: "Recoverable",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = materialOffcutReusableLengthTool.execute;
export default materialOffcutReusableLengthTool;
