import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly petioleLength: number;
  readonly bladeLength: number;
};
export type Output = {
  readonly petioleToBladeRatio: number;
  readonly totalLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    petioleLength: { type: "number", minimum: 0 },
    bladeLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["petioleLength", "bladeLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    petioleToBladeRatio: { type: "number" },
    totalLength: { type: "number" },
  },
  required: ["petioleToBladeRatio", "totalLength"],
} as const;
/** Compare explicitly measured petiole and blade lengths on the same straight-length basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { petioleLength, bladeLength } = request;
  const compute = (): Output => {
    H.domain(petioleLength >= 0, "petioleLength");
    (H.domain(bladeLength > 0, "bladeLength"), bladeLength);
    return {
      petioleToBladeRatio: petioleLength / bladeLength,
      totalLength: petioleLength + bladeLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { petioleLength: 2, bladeLength: 8 },
  output: { petioleToBladeRatio: 0.25, totalLength: 10 },
} satisfies ToolExample<Input, Output>;
export const leafPetioleBladeRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["botany", "biology"],
      keywords: ["botany", "biology"],
    },
    id: "botany/leaf-petiole-blade-ratio",
    title: "Leaf Petiole Blade Ratio",
    description:
      "Compare explicitly measured petiole and blade lengths on the same straight-length basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        petioleLength: { type: "number", minimum: 0 },
        bladeLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["petioleLength", "bladeLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        petioleToBladeRatio: { type: "number" },
        totalLength: { type: "number" },
      },
      required: ["petioleToBladeRatio", "totalLength"],
    },
    ports: {
      inputs: [
        {
          id: "petioleLength",
          label: "Petiole Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bladeLength",
          label: "Blade Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "petioleToBladeRatio",
          label: "Petiole To Blade Ratio",
          valueType: { type: "number" },
        },
        {
          id: "totalLength",
          label: "Total Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = leafPetioleBladeRatioTool.execute;
export default leafPetioleBladeRatioTool;
