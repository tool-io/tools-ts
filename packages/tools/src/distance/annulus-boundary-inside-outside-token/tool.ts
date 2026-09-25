import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly inner: number;
  readonly outer: number;
  readonly includeInner: boolean;
  readonly includeOuter: boolean;
};
export type Output = { readonly location: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    inner: { type: "number", minimum: 0 },
    outer: { type: "number" },
    includeInner: { type: "boolean" },
    includeOuter: { type: "boolean" },
  },
  required: ["distance", "inner", "outer", "includeInner", "includeOuter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { location: { type: "string", maxLength: 8192 } },
  required: ["location"],
} as const;
/** Classify a radial distance against explicitly inclusive or exclusive annulus boundaries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, inner, outer, includeInner, includeOuter } = request;
  const compute = (): Output => {
    H.domain(distance >= 0 && inner >= 0 && outer >= inner);
    return {
      location:
        distance < inner
          ? "inner-hole"
          : distance > outer
            ? "outside"
            : distance === inner
              ? includeInner && (inner !== outer || includeOuter)
                ? "inside"
                : "excluded-inner-boundary"
              : distance === outer
                ? includeOuter
                  ? "inside"
                  : "excluded-outer-boundary"
                : "inside",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    distance: 2,
    inner: 2,
    outer: 5,
    includeInner: false,
    includeOuter: true,
  },
  output: { location: "excluded-inner-boundary" },
} satisfies ToolExample<Input, Output>;
export const annulusBoundaryInsideOutsideTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/annulus-boundary-inside-outside-token",
    title: "Annulus Boundary Inside Outside Token Tool",
    description:
      "Classify a radial distance against explicitly inclusive or exclusive annulus boundaries.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number", minimum: 0 },
        inner: { type: "number", minimum: 0 },
        outer: { type: "number" },
        includeInner: { type: "boolean" },
        includeOuter: { type: "boolean" },
      },
      required: ["distance", "inner", "outer", "includeInner", "includeOuter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { location: { type: "string", maxLength: 8192 } },
      required: ["location"],
    },
    ports: {
      inputs: [
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inner",
          label: "Inner",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outer",
          label: "Outer",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeInner",
          label: "Include Inner",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeOuter",
          label: "Include Outer",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "location", label: "Location", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = annulusBoundaryInsideOutsideTokenTool.execute;
export default annulusBoundaryInsideOutsideTokenTool;
