import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredTotal: number;
  readonly retainedOriginal: number;
  readonly suppliedOriginOffset: number;
};
export type Output = {
  readonly regeneratedLength: number;
  readonly correctedRegenerated: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredTotal: { type: "number", minimum: 0 },
    retainedOriginal: { type: "number", minimum: 0 },
    suppliedOriginOffset: { type: "number" },
  },
  required: ["measuredTotal", "retainedOriginal", "suppliedOriginOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regeneratedLength: { type: "number" },
    correctedRegenerated: { type: "number" },
  },
  required: ["regeneratedLength", "correctedRegenerated"],
} as const;
/** Calculate tail regeneration origin offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredTotal, retainedOriginal, suppliedOriginOffset } = request;
  const compute = (): Output => {
    H.domain(
      measuredTotal >= 0 &&
        retainedOriginal >= 0 &&
        retainedOriginal <= measuredTotal,
    );
    return {
      regeneratedLength: measuredTotal - retainedOriginal,
      correctedRegenerated:
        measuredTotal - retainedOriginal - suppliedOriginOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredTotal: 20, retainedOriginal: 12, suppliedOriginOffset: 1 },
  output: { regeneratedLength: 8, correctedRegenerated: 7 },
} satisfies ToolExample<Input, Output>;
export const tailRegenerationOriginOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/tail-regeneration-origin-offset",
    title: "Tail Regeneration Origin Offset Tool",
    description:
      "Calculate tail regeneration origin offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredTotal: { type: "number", minimum: 0 },
        retainedOriginal: { type: "number", minimum: 0 },
        suppliedOriginOffset: { type: "number" },
      },
      required: ["measuredTotal", "retainedOriginal", "suppliedOriginOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        regeneratedLength: { type: "number" },
        correctedRegenerated: { type: "number" },
      },
      required: ["regeneratedLength", "correctedRegenerated"],
    },
    ports: {
      inputs: [
        {
          id: "measuredTotal",
          label: "Measured Total",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "retainedOriginal",
          label: "Retained Original",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedOriginOffset",
          label: "Supplied Origin Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "regeneratedLength",
          label: "Regenerated Length",
          valueType: { type: "number" },
        },
        {
          id: "correctedRegenerated",
          label: "Corrected Regenerated",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tailRegenerationOriginOffsetTool.execute;
export default tailRegenerationOriginOffsetTool;
