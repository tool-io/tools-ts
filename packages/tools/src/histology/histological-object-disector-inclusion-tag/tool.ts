import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referencePresent: boolean;
  readonly lookupPresent: boolean;
  readonly touchesForbiddenEdge: boolean;
  readonly insideFrame: boolean;
};
export type Output = {
  readonly counted: boolean;
  readonly lostAcrossPlane: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referencePresent: { type: "boolean" },
    lookupPresent: { type: "boolean" },
    touchesForbiddenEdge: { type: "boolean" },
    insideFrame: { type: "boolean" },
  },
  required: [
    "referencePresent",
    "lookupPresent",
    "touchesForbiddenEdge",
    "insideFrame",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counted: { type: "boolean" },
    lostAcrossPlane: { type: "boolean" },
  },
  required: ["counted", "lostAcrossPlane"],
} as const;
/** One physical-disector Q-minus inclusion decision from explicit observations and counting-frame flags; no object detection is performed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referencePresent, lookupPresent, touchesForbiddenEdge, insideFrame } =
    request;
  const compute = (): Output => {
    return {
      counted:
        insideFrame &&
        !touchesForbiddenEdge &&
        referencePresent &&
        !lookupPresent,
      lostAcrossPlane: referencePresent && !lookupPresent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referencePresent: true,
    lookupPresent: false,
    touchesForbiddenEdge: false,
    insideFrame: true,
  },
  output: { counted: true, lostAcrossPlane: true },
} satisfies ToolExample<Input, Output>;
export const histologicalObjectDisectorInclusionTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "histology/histological-object-disector-inclusion-tag",
      title: "Histological Object Disector Inclusion Tag Tool",
      description:
        "One physical-disector Q-minus inclusion decision from explicit observations and counting-frame flags; no object detection is performed.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referencePresent: { type: "boolean" },
          lookupPresent: { type: "boolean" },
          touchesForbiddenEdge: { type: "boolean" },
          insideFrame: { type: "boolean" },
        },
        required: [
          "referencePresent",
          "lookupPresent",
          "touchesForbiddenEdge",
          "insideFrame",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          counted: { type: "boolean" },
          lostAcrossPlane: { type: "boolean" },
        },
        required: ["counted", "lostAcrossPlane"],
      },
      ports: {
        inputs: [
          {
            id: "referencePresent",
            label: "Reference Present",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "lookupPresent",
            label: "Lookup Present",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "touchesForbiddenEdge",
            label: "Touches Forbidden Edge",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "insideFrame",
            label: "Inside Frame",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "counted", label: "Counted", valueType: { type: "boolean" } },
          {
            id: "lostAcrossPlane",
            label: "Lost Across Plane",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = histologicalObjectDisectorInclusionTagTool.execute;
export default histologicalObjectDisectorInclusionTagTool;
