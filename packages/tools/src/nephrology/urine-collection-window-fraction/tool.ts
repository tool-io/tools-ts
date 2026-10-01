import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectionStart: number;
  readonly collectionEnd: number;
  readonly targetStart: number;
  readonly targetEnd: number;
};
export type Output = {
  readonly overlapDuration: number;
  readonly targetFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectionStart: { type: "number" },
    collectionEnd: { type: "number" },
    targetStart: { type: "number" },
    targetEnd: { type: "number" },
  },
  required: ["collectionStart", "collectionEnd", "targetStart", "targetEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapDuration: { type: "number" },
    targetFraction: { type: "number" },
  },
  required: ["overlapDuration", "targetFraction"],
} as const;
/** Audit supplied collection/target time-window coverage without inferring specimen completeness or renal function. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectionStart, collectionEnd, targetStart, targetEnd } = request;
  const compute = (): Output => {
    H.domain(collectionStart <= collectionEnd && targetStart < targetEnd);
    return {
      overlapDuration: Math.max(
        0,
        Math.min(collectionEnd, targetEnd) -
          Math.max(collectionStart, targetStart),
      ),
      targetFraction:
        Math.max(
          0,
          Math.min(collectionEnd, targetEnd) -
            Math.max(collectionStart, targetStart),
        ) /
        (targetEnd - targetStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    collectionStart: 0,
    collectionEnd: 12,
    targetStart: 0,
    targetEnd: 24,
  },
  output: { overlapDuration: 12, targetFraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const urineCollectionWindowFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nephrology/urine-collection-window-fraction",
    title: "Urine Collection Window Fraction Tool",
    description:
      "Audit supplied collection/target time-window coverage without inferring specimen completeness or renal function.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectionStart: { type: "number" },
        collectionEnd: { type: "number" },
        targetStart: { type: "number" },
        targetEnd: { type: "number" },
      },
      required: [
        "collectionStart",
        "collectionEnd",
        "targetStart",
        "targetEnd",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapDuration: { type: "number" },
        targetFraction: { type: "number" },
      },
      required: ["overlapDuration", "targetFraction"],
    },
    ports: {
      inputs: [
        {
          id: "collectionStart",
          label: "Collection Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "collectionEnd",
          label: "Collection End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetStart",
          label: "Target Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetEnd",
          label: "Target End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapDuration",
          label: "Overlap Duration",
          valueType: { type: "number" },
        },
        {
          id: "targetFraction",
          label: "Target Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = urineCollectionWindowFractionTool.execute;
export default urineCollectionWindowFractionTool;
