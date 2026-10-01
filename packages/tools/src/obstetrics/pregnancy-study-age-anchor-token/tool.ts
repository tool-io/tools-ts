import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly anchorToken: string;
  readonly allowedAnchors: readonly string[];
  readonly elapsedDays: number;
  readonly suppliedAnchorOffsetDays: number;
};
export type Output = {
  readonly recognized: boolean;
  readonly anchoredDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    anchorToken: { type: "string", maxLength: 8192 },
    allowedAnchors: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    elapsedDays: { type: "integer" },
    suppliedAnchorOffsetDays: { type: "integer" },
  },
  required: [
    "anchorToken",
    "allowedAnchors",
    "elapsedDays",
    "suppliedAnchorOffsetDays",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recognized: { type: "boolean" },
    anchoredDays: { type: "integer" },
  },
  required: ["recognized", "anchoredDays"],
} as const;
/** Audit a research age-anchor token and supplied day offset without deriving gestational age or clinical dating. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { anchorToken, allowedAnchors, elapsedDays, suppliedAnchorOffsetDays } =
    request;
  const compute = (): Output => {
    return {
      recognized: allowedAnchors.includes(anchorToken),
      anchoredDays: elapsedDays + suppliedAnchorOffsetDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    anchorToken: "A",
    allowedAnchors: ["A", "B"],
    elapsedDays: 100,
    suppliedAnchorOffsetDays: 14,
  },
  output: { recognized: true, anchoredDays: 114 },
} satisfies ToolExample<Input, Output>;
export const pregnancyStudyAgeAnchorTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "obstetrics/pregnancy-study-age-anchor-token",
    title: "Pregnancy Study Age Anchor Token Tool",
    description:
      "Audit a research age-anchor token and supplied day offset without deriving gestational age or clinical dating.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        anchorToken: { type: "string", maxLength: 8192 },
        allowedAnchors: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        elapsedDays: { type: "integer" },
        suppliedAnchorOffsetDays: { type: "integer" },
      },
      required: [
        "anchorToken",
        "allowedAnchors",
        "elapsedDays",
        "suppliedAnchorOffsetDays",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognized: { type: "boolean" },
        anchoredDays: { type: "integer" },
      },
      required: ["recognized", "anchoredDays"],
    },
    ports: {
      inputs: [
        {
          id: "anchorToken",
          label: "Anchor Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedAnchors",
          label: "Allowed Anchors",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "elapsedDays",
          label: "Elapsed Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedAnchorOffsetDays",
          label: "Supplied Anchor Offset Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
        {
          id: "anchoredDays",
          label: "Anchored Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = pregnancyStudyAgeAnchorTokenTool.execute;
export default pregnancyStudyAgeAnchorTokenTool;
