import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredDepth: number;
  readonly datumOffset: number;
};
export type Output = { readonly referencedDepth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredDepth: { type: "number" },
    datumOffset: { type: "number" },
  },
  required: ["measuredDepth", "datumOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referencedDepth: { type: "number" } },
  required: ["referencedDepth"],
} as const;
/** Apply a signed caller-supplied depth-datum offset without a settling model or process interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredDepth, datumOffset } = request;
  const compute = (): Output => {
    return { referencedDepth: measuredDepth + datumOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredDepth: 2.5, datumOffset: -0.3 },
  output: { referencedDepth: 2.2 },
} satisfies ToolExample<Input, Output>;
export const settlerSludgeBlanketDepthReferenceOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "environmental-engineering",
          "environmental engineering",
          "engineering",
        ],
        keywords: ["environmental engineering", "engineering"],
      },
      id: "environmental-engineering/settler-sludge-blanket-depth-reference-offset",
      title: "Settler Sludge Blanket Depth Reference Offset",
      description:
        "Apply a signed caller-supplied depth-datum offset without a settling model or process interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measuredDepth: { type: "number" },
          datumOffset: { type: "number" },
        },
        required: ["measuredDepth", "datumOffset"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { referencedDepth: { type: "number" } },
        required: ["referencedDepth"],
      },
      ports: {
        inputs: [
          {
            id: "measuredDepth",
            label: "Measured Depth",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "datumOffset",
            label: "Datum Offset",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "referencedDepth",
            label: "Referenced Depth",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = settlerSludgeBlanketDepthReferenceOffsetTool.execute;
export default settlerSludgeBlanketDepthReferenceOffsetTool;
