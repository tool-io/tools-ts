import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly annotationOffset: number;
  readonly scopeStart: number;
  readonly scopeEnd: number;
};
export type Output = { readonly withinScope: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annotationOffset: { type: "integer", minimum: 0 },
    scopeStart: { type: "integer", minimum: 0 },
    scopeEnd: { type: "integer" },
  },
  required: ["annotationOffset", "scopeStart", "scopeEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { withinScope: { type: "boolean" } },
  required: ["withinScope"],
} as const;
/** Check explicit annotation offset membership in a half-open argument-text scope without interpreting the argument. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { annotationOffset, scopeStart, scopeEnd } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(annotationOffset) &&
        annotationOffset >= 0 &&
        annotationOffset <= Number.MAX_SAFE_INTEGER,
      "annotationOffset",
    ),
      annotationOffset);
    (H.domain(
      Number.isSafeInteger(scopeStart) &&
        scopeStart >= 0 &&
        scopeStart <= Number.MAX_SAFE_INTEGER,
      "scopeStart",
    ),
      scopeStart);
    (H.domain(
      Number.isSafeInteger(scopeEnd) &&
        scopeEnd >= scopeStart &&
        scopeEnd <= Number.MAX_SAFE_INTEGER,
      "scopeEnd",
    ),
      scopeEnd);
    return {
      withinScope:
        annotationOffset >= scopeStart && annotationOffset < scopeEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { annotationOffset: 12, scopeStart: 10, scopeEnd: 20 },
  output: { withinScope: true },
} satisfies ToolExample<Input, Output>;
export const argumentAnnotationScopeBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["critical-theory", "critical theory", "humanities"],
      keywords: ["critical theory", "humanities"],
    },
    id: "critical-theory/argument-annotation-scope-boundary",
    title: "Argument Annotation Scope Boundary",
    description:
      "Check explicit annotation offset membership in a half-open argument-text scope without interpreting the argument.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        annotationOffset: { type: "integer", minimum: 0 },
        scopeStart: { type: "integer", minimum: 0 },
        scopeEnd: { type: "integer" },
      },
      required: ["annotationOffset", "scopeStart", "scopeEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { withinScope: { type: "boolean" } },
      required: ["withinScope"],
    },
    ports: {
      inputs: [
        {
          id: "annotationOffset",
          label: "Annotation Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "scopeStart",
          label: "Scope Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "scopeEnd",
          label: "Scope End",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "withinScope",
          label: "Within Scope",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = argumentAnnotationScopeBoundaryTool.execute;
export default argumentAnnotationScopeBoundaryTool;
