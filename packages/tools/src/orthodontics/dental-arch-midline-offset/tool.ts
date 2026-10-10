import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredMidline: number;
  readonly referenceMidline: number;
  readonly positiveIsRight: boolean;
};
export type Output = { readonly rightPositiveOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredMidline: { type: "number" },
    referenceMidline: { type: "number" },
    positiveIsRight: { type: "boolean" },
  },
  required: ["measuredMidline", "referenceMidline", "positiveIsRight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rightPositiveOffset: { type: "number" } },
  required: ["rightPositiveOffset"],
} as const;
/** Reference an explicit dental-arch midline measurement under a supplied right-positive sign convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredMidline, referenceMidline, positiveIsRight } = request;
  const compute = (): Output => {
    return {
      rightPositiveOffset:
        (measuredMidline - referenceMidline) * (positiveIsRight ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredMidline: 3, referenceMidline: 1, positiveIsRight: true },
  output: { rightPositiveOffset: 2 },
} satisfies ToolExample<Input, Output>;
export const dentalArchMidlineOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["orthodontics", "health and medicine"],
      keywords: ["orthodontics", "health and medicine"],
    },
    id: "orthodontics/dental-arch-midline-offset",
    title: "Dental Arch Midline Offset",
    description:
      "Reference an explicit dental-arch midline measurement under a supplied right-positive sign convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredMidline: { type: "number" },
        referenceMidline: { type: "number" },
        positiveIsRight: { type: "boolean" },
      },
      required: ["measuredMidline", "referenceMidline", "positiveIsRight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rightPositiveOffset: { type: "number" } },
      required: ["rightPositiveOffset"],
    },
    ports: {
      inputs: [
        {
          id: "measuredMidline",
          label: "Measured Midline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceMidline",
          label: "Reference Midline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveIsRight",
          label: "Positive Is Right",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "rightPositiveOffset",
          label: "Right Positive Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dentalArchMidlineOffsetTool.execute;
export default dentalArchMidlineOffsetTool;
