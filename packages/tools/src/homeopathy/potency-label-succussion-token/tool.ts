import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly label: string;
  readonly suppliedScaleTokens: readonly string[];
  readonly suppliedSuccussionMarker: string;
};
export type Output = {
  readonly markerPresent: boolean;
  readonly matchedScaleTokens: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    suppliedScaleTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedSuccussionMarker: { type: "string", maxLength: 8192 },
  },
  required: ["label", "suppliedScaleTokens", "suppliedSuccussionMarker"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markerPresent: { type: "boolean" },
    matchedScaleTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["markerPresent", "matchedScaleTokens"],
} as const;
/** Inspect literal historical label fragments, without asserting chemistry, efficacy or preparation requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { label, suppliedScaleTokens, suppliedSuccussionMarker } = request;
  const compute = (): Output => {
    H.domain(suppliedSuccussionMarker.length > 0);
    return {
      markerPresent: label.includes(suppliedSuccussionMarker),
      matchedScaleTokens: suppliedScaleTokens.filter(
        (x) => x !== "" && label.includes(x),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    label: "12X S",
    suppliedScaleTokens: ["X", "C"],
    suppliedSuccussionMarker: "S",
  },
  output: { markerPresent: true, matchedScaleTokens: ["X"] },
} satisfies ToolExample<Input, Output>;
export const potencyLabelSuccussionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "homeopathy/potency-label-succussion-token",
    title: "Potency Label Succussion Token Tool",
    description:
      "Inspect literal historical label fragments, without asserting chemistry, efficacy or preparation requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        suppliedScaleTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedSuccussionMarker: { type: "string", maxLength: 8192 },
      },
      required: ["label", "suppliedScaleTokens", "suppliedSuccussionMarker"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        markerPresent: { type: "boolean" },
        matchedScaleTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["markerPresent", "matchedScaleTokens"],
    },
    ports: {
      inputs: [
        {
          id: "label",
          label: "Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedScaleTokens",
          label: "Supplied Scale Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedSuccussionMarker",
          label: "Supplied Succussion Marker",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "markerPresent",
          label: "Marker Present",
          valueType: { type: "boolean" },
        },
        {
          id: "matchedScaleTokens",
          label: "Matched Scale Tokens",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = potencyLabelSuccussionTokenTool.execute;
export default potencyLabelSuccussionTokenTool;
