import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedEffect: number;
  readonly suppliedCeiling: number;
  readonly ceilingKnown: boolean;
};
export type Output = {
  readonly headroomDefined: boolean;
  readonly headroom: number;
  readonly atOrAboveCeiling: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedEffect: { type: "number" },
    suppliedCeiling: { type: "number" },
    ceilingKnown: { type: "boolean" },
  },
  required: ["reportedEffect", "suppliedCeiling", "ceilingKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headroomDefined: { type: "boolean" },
    headroom: { type: "number" },
    atOrAboveCeiling: { type: "boolean" },
  },
  required: ["headroomDefined", "headroom", "atOrAboveCeiling"],
} as const;
/** Compare supplied assay effects to an explicit ceiling, preserving unknown bounds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedEffect, suppliedCeiling, ceilingKnown } = request;
  const compute = (): Output => {
    return {
      headroomDefined: ceilingKnown,
      headroom: ceilingKnown ? suppliedCeiling - reportedEffect : 0,
      atOrAboveCeiling: ceilingKnown && reportedEffect >= suppliedCeiling,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedEffect: 80, suppliedCeiling: 100, ceilingKnown: true },
  output: { headroomDefined: true, headroom: 20, atOrAboveCeiling: false },
} satisfies ToolExample<Input, Output>;
export const pdAssayCeilingGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "pharmacodynamics/pd-assay-ceiling-gap",
    title: "PD Assay Ceiling Gap Tool",
    description:
      "Compare supplied assay effects to an explicit ceiling, preserving unknown bounds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedEffect: { type: "number" },
        suppliedCeiling: { type: "number" },
        ceilingKnown: { type: "boolean" },
      },
      required: ["reportedEffect", "suppliedCeiling", "ceilingKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headroomDefined: { type: "boolean" },
        headroom: { type: "number" },
        atOrAboveCeiling: { type: "boolean" },
      },
      required: ["headroomDefined", "headroom", "atOrAboveCeiling"],
    },
    ports: {
      inputs: [
        {
          id: "reportedEffect",
          label: "Reported Effect",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCeiling",
          label: "Supplied Ceiling",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ceilingKnown",
          label: "Ceiling Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "headroomDefined",
          label: "Headroom Defined",
          valueType: { type: "boolean" },
        },
        { id: "headroom", label: "Headroom", valueType: { type: "number" } },
        {
          id: "atOrAboveCeiling",
          label: "At Or Above Ceiling",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = pdAssayCeilingGapTool.execute;
export default pdAssayCeilingGapTool;
