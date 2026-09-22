import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly patchAreas: readonly number[];
  readonly referencePatch: readonly boolean[];
  readonly imageArea: number;
};
export type Output = {
  readonly referenceArea: number;
  readonly share: number;
  readonly patchCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    patchAreas: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    referencePatch: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    imageArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["patchAreas", "referencePatch", "imageArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceArea: { type: "number" },
    share: { type: "number" },
    patchCount: { type: "integer" },
  },
  required: ["referenceArea", "share", "patchCount"],
} as const;
/** Aggregate explicit nonoverlapping patch areas; reference classification is supplied, not detected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { patchAreas, referencePatch, imageArea } = request;
  const compute = (): Output => {
    H.sameLength(patchAreas, referencePatch);
    H.domain(patchAreas.every((x) => x >= 0));
    H.positive(imageArea);
    return (() => {
      const referenceArea = patchAreas.reduce(
        (s, x, i) => s + (referencePatch[i] ? x : 0),
        0,
      );
      H.domain(patchAreas.reduce((a, b) => a + b, 0) <= imageArea);
      return {
        referenceArea,
        share: referenceArea / imageArea,
        patchCount: referencePatch.filter(Boolean).length,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    patchAreas: [10, 20, 30],
    referencePatch: [true, false, true],
    imageArea: 100,
  },
  output: { referenceArea: 40, share: 0.4, patchCount: 2 },
} satisfies ToolExample<Input, Output>;
export const photoReferencePatchAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/photo-reference-patch-area-share",
    title: "Photo Reference Patch Area Share Tool",
    description:
      "Aggregate explicit nonoverlapping patch areas; reference classification is supplied, not detected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        patchAreas: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        referencePatch: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        imageArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["patchAreas", "referencePatch", "imageArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceArea: { type: "number" },
        share: { type: "number" },
        patchCount: { type: "integer" },
      },
      required: ["referenceArea", "share", "patchCount"],
    },
    ports: {
      inputs: [
        {
          id: "patchAreas",
          label: "Patch Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referencePatch",
          label: "Reference Patch",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "imageArea",
          label: "Image Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referenceArea",
          label: "Reference Area",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        {
          id: "patchCount",
          label: "Patch Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = photoReferencePatchAreaShareTool.execute;
export default photoReferencePatchAreaShareTool;
