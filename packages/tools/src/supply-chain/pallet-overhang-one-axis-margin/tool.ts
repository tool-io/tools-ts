import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly palletWidth: number;
  readonly loadWidth: number;
  readonly offset: number;
  readonly allowedOverhang: number;
};
export type Output = {
  readonly leftOverhang: number;
  readonly rightOverhang: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    palletWidth: { type: "number", minimum: 0 },
    loadWidth: { type: "number", minimum: 0 },
    offset: { type: "number" },
    allowedOverhang: { type: "number", minimum: 0 },
  },
  required: ["palletWidth", "loadWidth", "offset", "allowedOverhang"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftOverhang: { type: "number" },
    rightOverhang: { type: "number" },
    margin: { type: "number" },
  },
  required: ["leftOverhang", "rightOverhang", "margin"],
} as const;
/** Positive offset shifts a centered rectangular load toward the right edge. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { palletWidth, loadWidth, offset, allowedOverhang } = request;
  const compute = (): Output => {
    H.domain(palletWidth >= 0 && loadWidth >= 0 && allowedOverhang >= 0);
    return {
      leftOverhang: Math.max(0, (loadWidth - palletWidth) / 2 - offset),
      rightOverhang: Math.max(0, (loadWidth - palletWidth) / 2 + offset),
      margin:
        allowedOverhang -
        Math.max(0, (loadWidth - palletWidth) / 2 + Math.abs(offset)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { palletWidth: 100, loadWidth: 110, offset: 2, allowedOverhang: 10 },
  output: { leftOverhang: 3, rightOverhang: 7, margin: 3 },
} satisfies ToolExample<Input, Output>;
export const palletOverhangOneAxisMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/pallet-overhang-one-axis-margin",
    title: "Pallet Overhang One Axis Margin Tool",
    description:
      "Positive offset shifts a centered rectangular load toward the right edge.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        palletWidth: { type: "number", minimum: 0 },
        loadWidth: { type: "number", minimum: 0 },
        offset: { type: "number" },
        allowedOverhang: { type: "number", minimum: 0 },
      },
      required: ["palletWidth", "loadWidth", "offset", "allowedOverhang"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftOverhang: { type: "number" },
        rightOverhang: { type: "number" },
        margin: { type: "number" },
      },
      required: ["leftOverhang", "rightOverhang", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "palletWidth",
          label: "Pallet Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "loadWidth",
          label: "Load Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowedOverhang",
          label: "Allowed Overhang",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "leftOverhang",
          label: "Left Overhang",
          valueType: { type: "number" },
        },
        {
          id: "rightOverhang",
          label: "Right Overhang",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = palletOverhangOneAxisMarginTool.execute;
export default palletOverhangOneAxisMarginTool;
