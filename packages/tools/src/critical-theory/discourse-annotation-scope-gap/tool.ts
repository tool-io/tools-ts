import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly annotationStart: number;
  readonly annotationEnd: number;
  readonly contextStart: number;
  readonly contextEnd: number;
};
export type Output = {
  readonly outsideBefore: number;
  readonly outsideAfter: number;
  readonly insideUnits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annotationStart: { type: "integer", minimum: 0 },
    annotationEnd: { type: "integer" },
    contextStart: { type: "integer", minimum: 0 },
    contextEnd: { type: "integer" },
  },
  required: ["annotationStart", "annotationEnd", "contextStart", "contextEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outsideBefore: { type: "integer" },
    outsideAfter: { type: "integer" },
    insideUnits: { type: "integer" },
  },
  required: ["outsideBefore", "outsideAfter", "insideUnits"],
} as const;
/** Calculate discourse annotation scope gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { annotationStart, annotationEnd, contextStart, contextEnd } = request;
  const compute = (): Output => {
    H.integer(annotationStart, 0);
    H.integer(annotationEnd, annotationStart);
    H.integer(contextStart, 0);
    H.integer(contextEnd, contextStart);
    return {
      outsideBefore: Math.max(
        0,
        Math.min(annotationEnd, contextStart) - annotationStart,
      ),
      outsideAfter: Math.max(
        0,
        annotationEnd - Math.max(annotationStart, contextEnd),
      ),
      insideUnits: Math.max(
        0,
        Math.min(annotationEnd, contextEnd) -
          Math.max(annotationStart, contextStart),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    annotationStart: 2,
    annotationEnd: 12,
    contextStart: 5,
    contextEnd: 10,
  },
  output: { outsideBefore: 3, outsideAfter: 2, insideUnits: 5 },
} satisfies ToolExample<Input, Output>;
export const discourseAnnotationScopeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "critical-theory/discourse-annotation-scope-gap",
    title: "Discourse Annotation Scope Gap Tool",
    description:
      "Calculate discourse annotation scope gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        annotationStart: { type: "integer", minimum: 0 },
        annotationEnd: { type: "integer" },
        contextStart: { type: "integer", minimum: 0 },
        contextEnd: { type: "integer" },
      },
      required: [
        "annotationStart",
        "annotationEnd",
        "contextStart",
        "contextEnd",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outsideBefore: { type: "integer" },
        outsideAfter: { type: "integer" },
        insideUnits: { type: "integer" },
      },
      required: ["outsideBefore", "outsideAfter", "insideUnits"],
    },
    ports: {
      inputs: [
        {
          id: "annotationStart",
          label: "Annotation Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "annotationEnd",
          label: "Annotation End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "contextStart",
          label: "Context Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "contextEnd",
          label: "Context End",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "outsideBefore",
          label: "Outside Before",
          valueType: { type: "integer" },
        },
        {
          id: "outsideAfter",
          label: "Outside After",
          valueType: { type: "integer" },
        },
        {
          id: "insideUnits",
          label: "Inside Units",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = discourseAnnotationScopeGapTool.execute;
export default discourseAnnotationScopeGapTool;
