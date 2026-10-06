import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly waterHeight: number;
  readonly overflowHeight: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterHeight: { type: "number" },
    overflowHeight: { type: "number" },
  },
  required: ["waterHeight", "overflowHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract supplied water height from overflow height using a shared datum and unit without predicting overflow flow rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { waterHeight, overflowHeight } = request;
  const compute = (): Output => {
    return { signedGap: overflowHeight - waterHeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { waterHeight: 12, overflowHeight: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const aquacultureTankOverflowHeightMarginTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["aquaculture", "agriculture"],
        keywords: ["aquaculture", "agriculture"],
      },
      id: "aquaculture/aquaculture-tank-overflow-height-margin",
      title: "Aquaculture Tank Overflow Height Margin",
      description:
        "Subtract supplied water height from overflow height using a shared datum and unit without predicting overflow flow rate.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          waterHeight: { type: "number" },
          overflowHeight: { type: "number" },
        },
        required: ["waterHeight", "overflowHeight"],
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
            id: "waterHeight",
            label: "Water Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "overflowHeight",
            label: "Overflow Height",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = aquacultureTankOverflowHeightMarginTool.execute;
export default aquacultureTankOverflowHeightMarginTool;
