import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly response: number;
  readonly responseUnit: string;
  readonly lowerAnchor: number;
  readonly upperAnchor: number;
  readonly anchorUnit: string;
};
export type Output = {
  readonly insideAnchors: boolean;
  readonly normalized: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    response: { type: "number" },
    responseUnit: { type: "string", maxLength: 8192 },
    lowerAnchor: { type: "number" },
    upperAnchor: { type: "number" },
    anchorUnit: { type: "string", maxLength: 8192 },
  },
  required: [
    "response",
    "responseUnit",
    "lowerAnchor",
    "upperAnchor",
    "anchorUnit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    insideAnchors: { type: "boolean" },
    normalized: { type: "number" },
  },
  required: ["insideAnchors", "normalized"],
} as const;
/** Normalize a response only when its declared unit matches the supplied anchors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { response, responseUnit, lowerAnchor, upperAnchor, anchorUnit } =
    request;
  const compute = (): Output => {
    H.domain(
      responseUnit.length > 0 && responseUnit === anchorUnit,
      "responseUnit",
    );
    H.domain(upperAnchor > lowerAnchor, "upperAnchor");
    return {
      insideAnchors: response >= lowerAnchor && response <= upperAnchor,
      normalized: (response - lowerAnchor) / (upperAnchor - lowerAnchor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    response: 40,
    responseUnit: "mm",
    lowerAnchor: 0,
    upperAnchor: 100,
    anchorUnit: "mm",
  },
  output: { insideAnchors: true, normalized: 0.4 },
} satisfies ToolExample<Input, Output>;
export const rheumatologyResponseAnchorUnitGuardTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "rheumatology/rheumatology-response-anchor-unit-guard",
      title: "Rheumatology Response Anchor Unit Guard Tool",
      description:
        "Normalize a response only when its declared unit matches the supplied anchors.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          response: { type: "number" },
          responseUnit: { type: "string", maxLength: 8192 },
          lowerAnchor: { type: "number" },
          upperAnchor: { type: "number" },
          anchorUnit: { type: "string", maxLength: 8192 },
        },
        required: [
          "response",
          "responseUnit",
          "lowerAnchor",
          "upperAnchor",
          "anchorUnit",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          insideAnchors: { type: "boolean" },
          normalized: { type: "number" },
        },
        required: ["insideAnchors", "normalized"],
      },
      ports: {
        inputs: [
          {
            id: "response",
            label: "Response",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "responseUnit",
            label: "Response Unit",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "lowerAnchor",
            label: "Lower Anchor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upperAnchor",
            label: "Upper Anchor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "anchorUnit",
            label: "Anchor Unit",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "insideAnchors",
            label: "Inside Anchors",
            valueType: { type: "boolean" },
          },
          {
            id: "normalized",
            label: "Normalized",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = rheumatologyResponseAnchorUnitGuardTool.execute;
export default rheumatologyResponseAnchorUnitGuardTool;
