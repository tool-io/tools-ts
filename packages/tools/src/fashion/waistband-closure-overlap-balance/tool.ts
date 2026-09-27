import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cutLength: number;
  readonly waistLength: number;
  readonly seamEnds: number;
  readonly overlap: number;
  readonly ease: number;
};
export type Output = {
  readonly requiredLength: number;
  readonly surplus: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cutLength: { type: "number", minimum: 0 },
    waistLength: { type: "number", minimum: 0 },
    seamEnds: { type: "number", minimum: 0 },
    overlap: { type: "number", minimum: 0 },
    ease: { type: "number" },
  },
  required: ["cutLength", "waistLength", "seamEnds", "overlap", "ease"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredLength: { type: "number" },
    surplus: { type: "number" },
  },
  required: ["requiredLength", "surplus"],
} as const;
/** Calculate waistband closure overlap balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cutLength, waistLength, seamEnds, overlap, ease } = request;
  const compute = (): Output => {
    H.domain(
      cutLength >= 0 && waistLength >= 0 && seamEnds >= 0 && overlap >= 0,
    );
    return {
      requiredLength: waistLength + seamEnds + overlap + ease,
      surplus: cutLength - waistLength - seamEnds - overlap - ease,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cutLength: 90, waistLength: 80, seamEnds: 2, overlap: 3, ease: 1 },
  output: { requiredLength: 86, surplus: 4 },
} satisfies ToolExample<Input, Output>;
export const waistbandClosureOverlapBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/waistband-closure-overlap-balance",
    title: "Waistband Closure Overlap Balance Tool",
    description:
      "Calculate waistband closure overlap balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cutLength: { type: "number", minimum: 0 },
        waistLength: { type: "number", minimum: 0 },
        seamEnds: { type: "number", minimum: 0 },
        overlap: { type: "number", minimum: 0 },
        ease: { type: "number" },
      },
      required: ["cutLength", "waistLength", "seamEnds", "overlap", "ease"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredLength: { type: "number" },
        surplus: { type: "number" },
      },
      required: ["requiredLength", "surplus"],
    },
    ports: {
      inputs: [
        {
          id: "cutLength",
          label: "Cut Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waistLength",
          label: "Waist Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "seamEnds",
          label: "Seam Ends",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlap",
          label: "Overlap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ease",
          label: "Ease",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredLength",
          label: "Required Length",
          valueType: { type: "number" },
        },
        { id: "surplus", label: "Surplus", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = waistbandClosureOverlapBalanceTool.execute;
export default waistbandClosureOverlapBalanceTool;
