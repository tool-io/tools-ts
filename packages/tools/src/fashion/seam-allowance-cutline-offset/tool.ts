import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly seamlineCoordinate: number;
  readonly allowance: number;
  readonly outwardSign: number;
};
export type Output = { readonly cutlineCoordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seamlineCoordinate: { type: "number" },
    allowance: { type: "number", minimum: 0 },
    outwardSign: { type: "integer" },
  },
  required: ["seamlineCoordinate", "allowance", "outwardSign"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cutlineCoordinate: { type: "number" } },
  required: ["cutlineCoordinate"],
} as const;
/** Offset a straight seamline coordinate by a nonnegative allowance in an explicit outward axis direction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seamlineCoordinate, allowance, outwardSign } = request;
  const compute = (): Output => {
    H.domain(allowance >= 0, "allowance");
    H.domain(outwardSign === -1 || outwardSign === 1, "outwardSign");
    return { cutlineCoordinate: seamlineCoordinate + outwardSign * allowance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { seamlineCoordinate: 20, allowance: 1.5, outwardSign: 1 },
  output: { cutlineCoordinate: 21.5 },
} satisfies ToolExample<Input, Output>;
export const seamAllowanceCutlineOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/seam-allowance-cutline-offset",
    title: "Seam Allowance Cutline Offset Tool",
    description:
      "Offset a straight seamline coordinate by a nonnegative allowance in an explicit outward axis direction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seamlineCoordinate: { type: "number" },
        allowance: { type: "number", minimum: 0 },
        outwardSign: { type: "integer" },
      },
      required: ["seamlineCoordinate", "allowance", "outwardSign"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cutlineCoordinate: { type: "number" } },
      required: ["cutlineCoordinate"],
    },
    ports: {
      inputs: [
        {
          id: "seamlineCoordinate",
          label: "Seamline Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowance",
          label: "Allowance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outwardSign",
          label: "Outward Sign",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "cutlineCoordinate",
          label: "Cutline Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = seamAllowanceCutlineOffsetTool.execute;
export default seamAllowanceCutlineOffsetTool;
