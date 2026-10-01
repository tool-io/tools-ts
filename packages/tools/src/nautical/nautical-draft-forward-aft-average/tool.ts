import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly forward: number; readonly aft: number };
export type Output = { readonly meanDraft: number; readonly trim: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forward: { type: "number", minimum: 0 },
    aft: { type: "number", minimum: 0 },
  },
  required: ["forward", "aft"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { meanDraft: { type: "number" }, trim: { type: "number" } },
  required: ["meanDraft", "trim"],
} as const;
/** Calculate nautical draft forward aft average from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { forward, aft } = request;
  const compute = (): Output => {
    H.domain(forward >= 0 && aft >= 0);
    return { meanDraft: (forward + aft) / 2, trim: aft - forward };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { forward: 6, aft: 8 },
  output: { meanDraft: 7, trim: 2 },
} satisfies ToolExample<Input, Output>;
export const nauticalDraftForwardAftAverageTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/nautical-draft-forward-aft-average",
    title: "Nautical Draft Forward Aft Average Tool",
    description:
      "Calculate nautical draft forward aft average from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forward: { type: "number", minimum: 0 },
        aft: { type: "number", minimum: 0 },
      },
      required: ["forward", "aft"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { meanDraft: { type: "number" }, trim: { type: "number" } },
      required: ["meanDraft", "trim"],
    },
    ports: {
      inputs: [
        {
          id: "forward",
          label: "Forward",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "aft",
          label: "Aft",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "meanDraft", label: "Mean Draft", valueType: { type: "number" } },
        { id: "trim", label: "Trim", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = nauticalDraftForwardAftAverageTool.execute;
export default nauticalDraftForwardAftAverageTool;
