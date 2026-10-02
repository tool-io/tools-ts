import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visitMinutes: number;
  readonly childOnlyMinutes: number;
  readonly parentOnlyMinutes: number;
  readonly sharedMinutes: number;
};
export type Output = {
  readonly contactMinutes: number;
  readonly unallocatedMinutes: number;
  readonly childContact: number;
  readonly parentContact: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitMinutes: { type: "number", minimum: 0 },
    childOnlyMinutes: { type: "number", minimum: 0 },
    parentOnlyMinutes: { type: "number", minimum: 0 },
    sharedMinutes: { type: "number", minimum: 0 },
  },
  required: [
    "visitMinutes",
    "childOnlyMinutes",
    "parentOnlyMinutes",
    "sharedMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactMinutes: { type: "number" },
    unallocatedMinutes: { type: "number" },
    childContact: { type: "number" },
    parentContact: { type: "number" },
  },
  required: [
    "contactMinutes",
    "unallocatedMinutes",
    "childContact",
    "parentContact",
  ],
} as const;
/** Calculate pediatric visit parent child time split from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visitMinutes, childOnlyMinutes, parentOnlyMinutes, sharedMinutes } =
    request;
  const compute = (): Output => {
    H.domain(
      visitMinutes >= 0 &&
        childOnlyMinutes >= 0 &&
        parentOnlyMinutes >= 0 &&
        sharedMinutes >= 0 &&
        childOnlyMinutes + parentOnlyMinutes + sharedMinutes <= visitMinutes,
    );
    return {
      contactMinutes: childOnlyMinutes + parentOnlyMinutes + sharedMinutes,
      unallocatedMinutes:
        visitMinutes - childOnlyMinutes - parentOnlyMinutes - sharedMinutes,
      childContact: childOnlyMinutes + sharedMinutes,
      parentContact: parentOnlyMinutes + sharedMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    visitMinutes: 60,
    childOnlyMinutes: 10,
    parentOnlyMinutes: 15,
    sharedMinutes: 25,
  },
  output: {
    contactMinutes: 50,
    unallocatedMinutes: 10,
    childContact: 35,
    parentContact: 40,
  },
} satisfies ToolExample<Input, Output>;
export const pediatricVisitParentChildTimeSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pediatrics/pediatric-visit-parent-child-time-split",
    title: "Pediatric Visit Parent Child Time Split Tool",
    description:
      "Calculate pediatric visit parent child time split from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visitMinutes: { type: "number", minimum: 0 },
        childOnlyMinutes: { type: "number", minimum: 0 },
        parentOnlyMinutes: { type: "number", minimum: 0 },
        sharedMinutes: { type: "number", minimum: 0 },
      },
      required: [
        "visitMinutes",
        "childOnlyMinutes",
        "parentOnlyMinutes",
        "sharedMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactMinutes: { type: "number" },
        unallocatedMinutes: { type: "number" },
        childContact: { type: "number" },
        parentContact: { type: "number" },
      },
      required: [
        "contactMinutes",
        "unallocatedMinutes",
        "childContact",
        "parentContact",
      ],
    },
    ports: {
      inputs: [
        {
          id: "visitMinutes",
          label: "Visit Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "childOnlyMinutes",
          label: "Child Only Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "parentOnlyMinutes",
          label: "Parent Only Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "sharedMinutes",
          label: "Shared Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
      ],
      outputs: [
        {
          id: "contactMinutes",
          label: "Contact Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "unallocatedMinutes",
          label: "Unallocated Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "childContact",
          label: "Child Contact",
          valueType: { type: "number" },
        },
        {
          id: "parentContact",
          label: "Parent Contact",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pediatricVisitParentChildTimeSplitTool.execute;
export default pediatricVisitParentChildTimeSplitTool;
