import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly upperInterfaceDepth: number;
  readonly lowerInterfaceDepth: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    upperInterfaceDepth: { type: "number" },
    lowerInterfaceDepth: { type: "number" },
  },
  required: ["upperInterfaceDepth", "lowerInterfaceDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate lower minus upper supplied lake thermal-interface depth without inferring stratification thresholds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { upperInterfaceDepth, lowerInterfaceDepth } = request;
  const compute = (): Output => {
    return { signedGap: lowerInterfaceDepth - upperInterfaceDepth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { upperInterfaceDepth: 12, lowerInterfaceDepth: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const lakeThermalInterfaceDepthGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "aquatic-science",
        "aquatic science",
        "earth and environmental sciences",
      ],
      keywords: ["aquatic science", "earth and environmental sciences"],
    },
    id: "aquatic-science/lake-thermal-interface-depth-gap",
    title: "Lake Thermal Interface Depth Gap",
    description:
      "Calculate lower minus upper supplied lake thermal-interface depth without inferring stratification thresholds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        upperInterfaceDepth: { type: "number" },
        lowerInterfaceDepth: { type: "number" },
      },
      required: ["upperInterfaceDepth", "lowerInterfaceDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "upperInterfaceDepth",
          label: "Upper Interface Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerInterfaceDepth",
          label: "Lower Interface Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = lakeThermalInterfaceDepthGapTool.execute;
export default lakeThermalInterfaceDepthGapTool;
