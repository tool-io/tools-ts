import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly patchAreas: readonly number[];
  readonly stainPresent: readonly boolean[];
  readonly matchedReference: readonly boolean[];
};
export type Output = {
  readonly stainedArea: number;
  readonly referencedStainedArea: number;
  readonly share: number;
  readonly defined: boolean;
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
    stainPresent: { type: "array", maxItems: 256, items: { type: "boolean" } },
    matchedReference: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["patchAreas", "stainPresent", "matchedReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stainedArea: { type: "number" },
    referencedStainedArea: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["stainedArea", "referencedStainedArea", "share", "defined"],
} as const;
/** Calculate stain reference support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { patchAreas, stainPresent, matchedReference } = request;
  const compute = (): Output => {
    H.sameLength(patchAreas, stainPresent);
    H.sameLength(patchAreas, matchedReference);
    H.domain(patchAreas.every((x) => x >= 0));
    return (() => {
      const stainedArea = patchAreas.reduce(
          (s, x, i) => s + (stainPresent[i] ? x : 0),
          0,
        ),
        referencedStainedArea = patchAreas.reduce(
          (s, x, i) => s + (stainPresent[i] && matchedReference[i] ? x : 0),
          0,
        );
      return {
        stainedArea,
        referencedStainedArea,
        share: stainedArea > 0 ? referencedStainedArea / stainedArea : 0,
        defined: stainedArea > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    patchAreas: [2, 3, 5],
    stainPresent: [true, true, false],
    matchedReference: [true, false, true],
  },
  output: {
    stainedArea: 5,
    referencedStainedArea: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const stainReferenceSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/stain-reference-support-share",
    title: "Stain Reference Support Share Tool",
    description:
      "Calculate stain reference support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        patchAreas: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        stainPresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        matchedReference: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["patchAreas", "stainPresent", "matchedReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stainedArea: { type: "number" },
        referencedStainedArea: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["stainedArea", "referencedStainedArea", "share", "defined"],
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
          id: "stainPresent",
          label: "Stain Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "matchedReference",
          label: "Matched Reference",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "stainedArea",
          label: "Stained Area",
          valueType: { type: "number" },
        },
        {
          id: "referencedStainedArea",
          label: "Referenced Stained Area",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = stainReferenceSupportShareTool.execute;
export default stainReferenceSupportShareTool;
