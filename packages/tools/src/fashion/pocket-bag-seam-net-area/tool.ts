import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly height: number;
  readonly seamAllowance: number;
};
export type Output = {
  readonly netWidth: number;
  readonly netHeight: number;
  readonly netArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number" },
    height: { type: "number" },
    seamAllowance: { type: "number", minimum: 0 },
  },
  required: ["width", "height", "seamAllowance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netWidth: { type: "number" },
    netHeight: { type: "number" },
    netArea: { type: "number" },
  },
  required: ["netWidth", "netHeight", "netArea"],
} as const;
/** Rectangular pocket-bag approximation with an allowance deducted on all four edges. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, height, seamAllowance } = request;
  const compute = (): Output => {
    H.domain(
      seamAllowance >= 0 &&
        width >= 2 * seamAllowance &&
        height >= 2 * seamAllowance,
    );
    return {
      netWidth: width - 2 * seamAllowance,
      netHeight: height - 2 * seamAllowance,
      netArea: (width - 2 * seamAllowance) * (height - 2 * seamAllowance),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { width: 20, height: 25, seamAllowance: 1 },
  output: { netWidth: 18, netHeight: 23, netArea: 414 },
} satisfies ToolExample<Input, Output>;
export const pocketBagSeamNetAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/pocket-bag-seam-net-area",
    title: "Pocket Bag Seam Net Area Tool",
    description:
      "Rectangular pocket-bag approximation with an allowance deducted on all four edges.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number" },
        height: { type: "number" },
        seamAllowance: { type: "number", minimum: 0 },
      },
      required: ["width", "height", "seamAllowance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netWidth: { type: "number" },
        netHeight: { type: "number" },
        netArea: { type: "number" },
      },
      required: ["netWidth", "netHeight", "netArea"],
    },
    ports: {
      inputs: [
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "seamAllowance",
          label: "Seam Allowance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netWidth", label: "Net Width", valueType: { type: "number" } },
        { id: "netHeight", label: "Net Height", valueType: { type: "number" } },
        { id: "netArea", label: "Net Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pocketBagSeamNetAreaTool.execute;
export default pocketBagSeamNetAreaTool;
