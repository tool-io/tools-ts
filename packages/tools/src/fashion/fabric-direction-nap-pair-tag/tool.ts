import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pieceId: string;
  readonly grainDirectionText: string;
  readonly napDirectionText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pieceId: { type: "string", maxLength: 8192, minLength: 1 },
    grainDirectionText: { type: "string", maxLength: 8192, minLength: 1 },
    napDirectionText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["pieceId", "grainDirectionText", "napDirectionText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit fabric grain and nap direction labels without identifying textile structure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pieceId, grainDirectionText, napDirectionText } = request;
  const compute = (): Output => {
    H.domain(pieceId.length > 0, "pieceId");
    H.domain(grainDirectionText.length > 0, "grainDirectionText");
    H.domain(napDirectionText.length > 0, "napDirectionText");
    return {
      token: JSON.stringify([pieceId, grainDirectionText, napDirectionText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pieceId: "P17",
    grainDirectionText: "lengthwise",
    napDirectionText: "toward top",
  },
  output: { token: '["P17","lengthwise","toward top"]' },
} satisfies ToolExample<Input, Output>;
export const fabricDirectionNapPairTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["fashion", "arts and design"],
      keywords: ["fashion", "arts and design"],
    },
    id: "fashion/fabric-direction-nap-pair-tag",
    title: "Fabric Direction Nap Pair Tag",
    description:
      "Preserve explicit fabric grain and nap direction labels without identifying textile structure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pieceId: { type: "string", maxLength: 8192, minLength: 1 },
        grainDirectionText: { type: "string", maxLength: 8192, minLength: 1 },
        napDirectionText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["pieceId", "grainDirectionText", "napDirectionText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "pieceId",
          label: "Piece Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "grainDirectionText",
          label: "Grain Direction Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "napDirectionText",
          label: "Nap Direction Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fabricDirectionNapPairTagTool.execute;
export default fabricDirectionNapPairTagTool;
