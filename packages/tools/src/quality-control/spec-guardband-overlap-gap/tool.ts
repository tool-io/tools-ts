import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerSpec: number;
  readonly upperSpec: number;
  readonly lowerGuard: number;
  readonly upperGuard: number;
};
export type Output = {
  readonly acceptLower: number;
  readonly acceptUpper: number;
  readonly signedWidth: number;
  readonly empty: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerSpec: { type: "number" },
    upperSpec: { type: "number" },
    lowerGuard: { type: "number", minimum: 0 },
    upperGuard: { type: "number", minimum: 0 },
  },
  required: ["lowerSpec", "upperSpec", "lowerGuard", "upperGuard"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    acceptLower: { type: "number" },
    acceptUpper: { type: "number" },
    signedWidth: { type: "number" },
    empty: { type: "boolean" },
  },
  required: ["acceptLower", "acceptUpper", "signedWidth", "empty"],
} as const;
/** Inspect an explicitly supplied inward guardband geometry without deciding a conformity rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerSpec, upperSpec, lowerGuard, upperGuard } = request;
  const compute = (): Output => {
    H.domain(lowerSpec <= upperSpec && lowerGuard >= 0 && upperGuard >= 0);
    return {
      acceptLower: lowerSpec + lowerGuard,
      acceptUpper: upperSpec - upperGuard,
      signedWidth: upperSpec - upperGuard - lowerSpec - lowerGuard,
      empty: lowerSpec + lowerGuard > upperSpec - upperGuard,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerSpec: 0, upperSpec: 10, lowerGuard: 2, upperGuard: 3 },
  output: { acceptLower: 2, acceptUpper: 7, signedWidth: 5, empty: false },
} satisfies ToolExample<Input, Output>;
export const specGuardbandOverlapGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/spec-guardband-overlap-gap",
    title: "Spec Guardband Overlap Gap Tool",
    description:
      "Inspect an explicitly supplied inward guardband geometry without deciding a conformity rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerSpec: { type: "number" },
        upperSpec: { type: "number" },
        lowerGuard: { type: "number", minimum: 0 },
        upperGuard: { type: "number", minimum: 0 },
      },
      required: ["lowerSpec", "upperSpec", "lowerGuard", "upperGuard"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        acceptLower: { type: "number" },
        acceptUpper: { type: "number" },
        signedWidth: { type: "number" },
        empty: { type: "boolean" },
      },
      required: ["acceptLower", "acceptUpper", "signedWidth", "empty"],
    },
    ports: {
      inputs: [
        {
          id: "lowerSpec",
          label: "Lower Spec",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperSpec",
          label: "Upper Spec",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerGuard",
          label: "Lower Guard",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperGuard",
          label: "Upper Guard",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "acceptLower",
          label: "Accept Lower",
          valueType: { type: "number" },
        },
        {
          id: "acceptUpper",
          label: "Accept Upper",
          valueType: { type: "number" },
        },
        {
          id: "signedWidth",
          label: "Signed Width",
          valueType: { type: "number" },
        },
        { id: "empty", label: "Empty", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = specGuardbandOverlapGapTool.execute;
export default specGuardbandOverlapGapTool;
