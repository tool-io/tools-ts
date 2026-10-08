import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPlaneIndex: number;
  readonly secondPlaneIndex: number;
  readonly physicalStep: number;
};
export type Output = { readonly signedSpacing: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPlaneIndex: { type: "integer", minimum: 0 },
    secondPlaneIndex: { type: "integer", minimum: 0 },
    physicalStep: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstPlaneIndex", "secondPlaneIndex", "physicalStep"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedSpacing: { type: "number" } },
  required: ["signedSpacing"],
} as const;
/** Convert an explicit image-plane index difference to signed physical z spacing with a supplied positive step. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPlaneIndex, secondPlaneIndex, physicalStep } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(firstPlaneIndex) &&
        firstPlaneIndex >= 0 &&
        firstPlaneIndex <= Number.MAX_SAFE_INTEGER,
      "firstPlaneIndex",
    ),
      firstPlaneIndex);
    (H.domain(
      Number.isSafeInteger(secondPlaneIndex) &&
        secondPlaneIndex >= 0 &&
        secondPlaneIndex <= Number.MAX_SAFE_INTEGER,
      "secondPlaneIndex",
    ),
      secondPlaneIndex);
    (H.domain(
      Number.isFinite(physicalStep) && physicalStep > 0,
      "physicalStep",
    ),
      physicalStep);
    return {
      signedSpacing: (secondPlaneIndex - firstPlaneIndex) * physicalStep,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPlaneIndex: 2, secondPlaneIndex: 5, physicalStep: 0.5 },
  output: { signedSpacing: 1.5 },
} satisfies ToolExample<Input, Output>;
export const embryoImageZstepPhysicalSpacingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/embryo-image-zstep-physical-spacing",
    title: "Embryo Image Zstep Physical Spacing Tool",
    description:
      "Convert an explicit image-plane index difference to signed physical z spacing with a supplied positive step.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPlaneIndex: { type: "integer", minimum: 0 },
        secondPlaneIndex: { type: "integer", minimum: 0 },
        physicalStep: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstPlaneIndex", "secondPlaneIndex", "physicalStep"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedSpacing: { type: "number" } },
      required: ["signedSpacing"],
    },
    ports: {
      inputs: [
        {
          id: "firstPlaneIndex",
          label: "First Plane Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondPlaneIndex",
          label: "Second Plane Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "physicalStep",
          label: "Physical Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedSpacing",
          label: "Signed Spacing",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = embryoImageZstepPhysicalSpacingTool.execute;
export default embryoImageZstepPhysicalSpacingTool;
