import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly part: number;
  readonly whole: number;
  readonly excludedFromWhole: number;
  readonly excludedFromPart: number;
};
export type Output = {
  readonly remainingPart: number;
  readonly remainingWhole: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    part: { type: "number", minimum: 0 },
    whole: { type: "number", minimum: 0 },
    excludedFromWhole: { type: "number", minimum: 0 },
    excludedFromPart: { type: "number", minimum: 0 },
  },
  required: ["part", "whole", "excludedFromWhole", "excludedFromPart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingPart: { type: "number" },
    remainingWhole: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["remainingPart", "remainingWhole", "share", "defined"],
} as const;
/** Calculate part share after exclusion from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { part, whole, excludedFromWhole, excludedFromPart } = request;
  const compute = (): Output => {
    H.domain(
      whole >= 0 &&
        part >= 0 &&
        part <= whole &&
        excludedFromWhole >= 0 &&
        excludedFromWhole <= whole &&
        excludedFromPart >= 0 &&
        excludedFromPart <= part &&
        excludedFromPart <= excludedFromWhole &&
        part - excludedFromPart <= whole - excludedFromWhole,
    );
    return {
      remainingPart: part - excludedFromPart,
      remainingWhole: whole - excludedFromWhole,
      share:
        whole > excludedFromWhole
          ? (part - excludedFromPart) / (whole - excludedFromWhole)
          : 0,
      defined: whole > excludedFromWhole,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { part: 30, whole: 100, excludedFromWhole: 20, excludedFromPart: 10 },
  output: { remainingPart: 20, remainingWhole: 80, share: 0.25, defined: true },
} satisfies ToolExample<Input, Output>;
export const partShareAfterExclusionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/part-share-after-exclusion",
    title: "Part Share After Exclusion Tool",
    description:
      "Calculate part share after exclusion from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        part: { type: "number", minimum: 0 },
        whole: { type: "number", minimum: 0 },
        excludedFromWhole: { type: "number", minimum: 0 },
        excludedFromPart: { type: "number", minimum: 0 },
      },
      required: ["part", "whole", "excludedFromWhole", "excludedFromPart"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingPart: { type: "number" },
        remainingWhole: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["remainingPart", "remainingWhole", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "part",
          label: "Part",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "whole",
          label: "Whole",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedFromWhole",
          label: "Excluded From Whole",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedFromPart",
          label: "Excluded From Part",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingPart",
          label: "Remaining Part",
          valueType: { type: "number" },
        },
        {
          id: "remainingWhole",
          label: "Remaining Whole",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = partShareAfterExclusionTool.execute;
export default partShareAfterExclusionTool;
