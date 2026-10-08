import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly internalRadius: number;
  readonly lineLength: number;
};
export type Output = { readonly internalVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    internalRadius: { type: "number", minimum: 0 },
    lineLength: { type: "number", minimum: 0 },
  },
  required: ["internalRadius", "lineLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { internalVolume: { type: "number" } },
  required: ["internalVolume"],
} as const;
/** Calculate ideal cylindrical transfer-line internal volume from explicit radius and length without estimating fluid inventory or pressure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { internalRadius, lineLength } = request;
  const compute = (): Output => {
    H.domain(internalRadius >= 0, "internalRadius");
    H.domain(lineLength >= 0, "lineLength");
    return {
      internalVolume: Math.PI * internalRadius * internalRadius * lineLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { internalRadius: 1, lineLength: 2 },
  output: { internalVolume: 6.283185307179586 },
} satisfies ToolExample<Input, Output>;
export const cryogenicTransferLineHoldUpVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cryogenics", "physics"],
      keywords: ["cryogenics", "physics"],
    },
    id: "cryogenics/cryogenic-transfer-line-hold-up-volume",
    title: "Cryogenic Transfer Line Hold Up Volume",
    description:
      "Calculate ideal cylindrical transfer-line internal volume from explicit radius and length without estimating fluid inventory or pressure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        internalRadius: { type: "number", minimum: 0 },
        lineLength: { type: "number", minimum: 0 },
      },
      required: ["internalRadius", "lineLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { internalVolume: { type: "number" } },
      required: ["internalVolume"],
    },
    ports: {
      inputs: [
        {
          id: "internalRadius",
          label: "Internal Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lineLength",
          label: "Line Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "internalVolume",
          label: "Internal Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cryogenicTransferLineHoldUpVolumeTool.execute;
export default cryogenicTransferLineHoldUpVolumeTool;
