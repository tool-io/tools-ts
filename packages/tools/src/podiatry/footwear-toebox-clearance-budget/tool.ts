import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly internalLength: number;
  readonly footLength: number;
  readonly toeAllowance: number;
  readonly heelAllowance: number;
  readonly compression: number;
};
export type Output = {
  readonly grossGap: number;
  readonly residualGap: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    internalLength: { type: "number", minimum: 0 },
    footLength: { type: "number", minimum: 0 },
    toeAllowance: { type: "number", minimum: 0 },
    heelAllowance: { type: "number", minimum: 0 },
    compression: { type: "number", minimum: 0 },
  },
  required: [
    "internalLength",
    "footLength",
    "toeAllowance",
    "heelAllowance",
    "compression",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossGap: { type: "number" },
    residualGap: { type: "number" },
    fits: { type: "boolean" },
  },
  required: ["grossGap", "residualGap", "fits"],
} as const;
/** Calculate footwear toebox clearance budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    internalLength,
    footLength,
    toeAllowance,
    heelAllowance,
    compression,
  } = request;
  const compute = (): Output => {
    H.domain(
      internalLength >= 0 &&
        footLength >= 0 &&
        toeAllowance >= 0 &&
        heelAllowance >= 0 &&
        compression >= 0,
    );
    return {
      grossGap: internalLength - footLength,
      residualGap:
        internalLength -
        footLength -
        toeAllowance -
        heelAllowance -
        compression,
      fits:
        internalLength - footLength >=
        toeAllowance + heelAllowance + compression,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    internalLength: 270,
    footLength: 250,
    toeAllowance: 10,
    heelAllowance: 3,
    compression: 2,
  },
  output: { grossGap: 20, residualGap: 5, fits: true },
} satisfies ToolExample<Input, Output>;
export const footwearToeboxClearanceBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "podiatry/footwear-toebox-clearance-budget",
    title: "Footwear Toebox Clearance Budget Tool",
    description:
      "Calculate footwear toebox clearance budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        internalLength: { type: "number", minimum: 0 },
        footLength: { type: "number", minimum: 0 },
        toeAllowance: { type: "number", minimum: 0 },
        heelAllowance: { type: "number", minimum: 0 },
        compression: { type: "number", minimum: 0 },
      },
      required: [
        "internalLength",
        "footLength",
        "toeAllowance",
        "heelAllowance",
        "compression",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossGap: { type: "number" },
        residualGap: { type: "number" },
        fits: { type: "boolean" },
      },
      required: ["grossGap", "residualGap", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "internalLength",
          label: "Internal Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "footLength",
          label: "Foot Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "toeAllowance",
          label: "Toe Allowance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "heelAllowance",
          label: "Heel Allowance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "compression",
          label: "Compression",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "grossGap", label: "Gross Gap", valueType: { type: "number" } },
        {
          id: "residualGap",
          label: "Residual Gap",
          valueType: { type: "number" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = footwearToeboxClearanceBudgetTool.execute;
export default footwearToeboxClearanceBudgetTool;
