import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly internalLength: number;
  readonly internalWidth: number;
  readonly wallHeight: number;
  readonly includeBase: boolean;
};
export type Output = { readonly linerArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    internalLength: { type: "number", minimum: 0 },
    internalWidth: { type: "number", minimum: 0 },
    wallHeight: { type: "number", minimum: 0 },
    includeBase: { type: "boolean" },
  },
  required: ["internalLength", "internalWidth", "wallHeight", "includeBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { linerArea: { type: "number" } },
  required: ["linerArea"],
} as const;
/** Calculate rectangular internal wall area plus optional base area without adding seams, overlap, or waste allowances. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { internalLength, internalWidth, wallHeight, includeBase } = request;
  const compute = (): Output => {
    H.domain(
      internalLength >= 0 && internalWidth >= 0 && wallHeight >= 0,
      "internalLength",
    );
    return {
      linerArea:
        2 * wallHeight * (internalLength + internalWidth) +
        (includeBase ? internalLength * internalWidth : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    internalLength: 2,
    internalWidth: 1,
    wallHeight: 0.5,
    includeBase: true,
  },
  output: { linerArea: 5 },
} satisfies ToolExample<Input, Output>;
export const raisedbedLinerAreaTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["urban-agriculture", "urban agriculture", "agriculture"],
      keywords: ["urban agriculture", "agriculture"],
    },
    id: "urban-agriculture/raised-bed-liner-area",
    title: "Raised Bed Liner Area",
    description:
      "Calculate rectangular internal wall area plus optional base area without adding seams, overlap, or waste allowances.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        internalLength: { type: "number", minimum: 0 },
        internalWidth: { type: "number", minimum: 0 },
        wallHeight: { type: "number", minimum: 0 },
        includeBase: { type: "boolean" },
      },
      required: [
        "internalLength",
        "internalWidth",
        "wallHeight",
        "includeBase",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { linerArea: { type: "number" } },
      required: ["linerArea"],
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
          id: "internalWidth",
          label: "Internal Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wallHeight",
          label: "Wall Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeBase",
          label: "Include Base",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "linerArea", label: "Liner Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = raisedbedLinerAreaTool.execute;
export default raisedbedLinerAreaTool;
