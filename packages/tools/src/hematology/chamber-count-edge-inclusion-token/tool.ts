import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly onLeft: boolean;
  readonly onRight: boolean;
  readonly onTop: boolean;
  readonly onBottom: boolean;
  readonly includeLeft: boolean;
  readonly includeRight: boolean;
  readonly includeTop: boolean;
  readonly includeBottom: boolean;
};
export type Output = { readonly included: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onLeft: { type: "boolean" },
    onRight: { type: "boolean" },
    onTop: { type: "boolean" },
    onBottom: { type: "boolean" },
    includeLeft: { type: "boolean" },
    includeRight: { type: "boolean" },
    includeTop: { type: "boolean" },
    includeBottom: { type: "boolean" },
  },
  required: [
    "onLeft",
    "onRight",
    "onTop",
    "onBottom",
    "includeLeft",
    "includeRight",
    "includeTop",
    "includeBottom",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { included: { type: "boolean" } },
  required: ["included"],
} as const;
/** Evaluate explicitly supplied chamber edge flags without selecting a counting protocol. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    onLeft,
    onRight,
    onTop,
    onBottom,
    includeLeft,
    includeRight,
    includeTop,
    includeBottom,
  } = request;
  const compute = (): Output => {
    return {
      included:
        (!onLeft || includeLeft) &&
        (!onRight || includeRight) &&
        (!onTop || includeTop) &&
        (!onBottom || includeBottom),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    onLeft: true,
    onRight: false,
    onTop: true,
    onBottom: false,
    includeLeft: true,
    includeRight: false,
    includeTop: true,
    includeBottom: false,
  },
  output: { included: true },
} satisfies ToolExample<Input, Output>;
export const chamberCountEdgeInclusionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/chamber-count-edge-inclusion-token",
    title: "Chamber Count Edge Inclusion Token Tool",
    description:
      "Evaluate explicitly supplied chamber edge flags without selecting a counting protocol.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        onLeft: { type: "boolean" },
        onRight: { type: "boolean" },
        onTop: { type: "boolean" },
        onBottom: { type: "boolean" },
        includeLeft: { type: "boolean" },
        includeRight: { type: "boolean" },
        includeTop: { type: "boolean" },
        includeBottom: { type: "boolean" },
      },
      required: [
        "onLeft",
        "onRight",
        "onTop",
        "onBottom",
        "includeLeft",
        "includeRight",
        "includeTop",
        "includeBottom",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { included: { type: "boolean" } },
      required: ["included"],
    },
    ports: {
      inputs: [
        {
          id: "onLeft",
          label: "On Left",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "onRight",
          label: "On Right",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "onTop",
          label: "On Top",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "onBottom",
          label: "On Bottom",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeLeft",
          label: "Include Left",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeRight",
          label: "Include Right",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeTop",
          label: "Include Top",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeBottom",
          label: "Include Bottom",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "included", label: "Included", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = chamberCountEdgeInclusionTokenTool.execute;
export default chamberCountEdgeInclusionTokenTool;
