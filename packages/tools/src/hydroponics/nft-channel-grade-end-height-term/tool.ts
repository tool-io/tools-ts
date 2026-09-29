import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly slope: number;
  readonly inletHeight: number;
};
export type Output = {
  readonly heightDifference: number;
  readonly outletHeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    slope: { type: "number" },
    inletHeight: { type: "number" },
  },
  required: ["length", "slope", "inletHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heightDifference: { type: "number" },
    outletHeight: { type: "number" },
  },
  required: ["heightDifference", "outletHeight"],
} as const;
/** Calculate nft channel grade end height term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, slope, inletHeight } = request;
  const compute = (): Output => {
    H.domain(length >= 0);
    return {
      heightDifference: length * slope,
      outletHeight: inletHeight - length * slope,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 10, slope: 0.02, inletHeight: 1 },
  output: { heightDifference: 0.2, outletHeight: 0.8 },
} satisfies ToolExample<Input, Output>;
export const nftChannelGradeEndHeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/nft-channel-grade-end-height-term",
    title: "NFT Channel Grade End Height Term Tool",
    description:
      "Calculate nft channel grade end height term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number", minimum: 0 },
        slope: { type: "number" },
        inletHeight: { type: "number" },
      },
      required: ["length", "slope", "inletHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heightDifference: { type: "number" },
        outletHeight: { type: "number" },
      },
      required: ["heightDifference", "outletHeight"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slope",
          label: "Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inletHeight",
          label: "Inlet Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "heightDifference",
          label: "Height Difference",
          valueType: { type: "number" },
        },
        {
          id: "outletHeight",
          label: "Outlet Height",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nftChannelGradeEndHeightTermTool.execute;
export default nftChannelGradeEndHeightTermTool;
