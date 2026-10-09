import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lostSectionCount: number;
  readonly suppliedSectionThickness: number;
};
export type Output = { readonly lostDepth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lostSectionCount: { type: "integer", minimum: 0 },
    suppliedSectionThickness: { type: "number", minimum: 0 },
  },
  required: ["lostSectionCount", "suppliedSectionThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lostDepth: { type: "number" } },
  required: ["lostDepth"],
} as const;
/** Multiply explicitly recorded lost cryosection count by supplied uniform thickness without estimating unobserved tissue loss. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lostSectionCount, suppliedSectionThickness } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(lostSectionCount) &&
        lostSectionCount >= 0 &&
        lostSectionCount <= Number.MAX_SAFE_INTEGER,
      "lostSectionCount",
    ),
      lostSectionCount);
    H.domain(suppliedSectionThickness >= 0, "suppliedSectionThickness");
    return { lostDepth: lostSectionCount * suppliedSectionThickness };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lostSectionCount: 3, suppliedSectionThickness: 5 },
  output: { lostDepth: 15 },
} satisfies ToolExample<Input, Output>;
export const cryosectionCurlLossDepthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/cryosection-curl-loss-depth-term",
    title: "Cryosection Curl Loss Depth Term Tool",
    description:
      "Multiply explicitly recorded lost cryosection count by supplied uniform thickness without estimating unobserved tissue loss.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lostSectionCount: { type: "integer", minimum: 0 },
        suppliedSectionThickness: { type: "number", minimum: 0 },
      },
      required: ["lostSectionCount", "suppliedSectionThickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lostDepth: { type: "number" } },
      required: ["lostDepth"],
    },
    ports: {
      inputs: [
        {
          id: "lostSectionCount",
          label: "Lost Section Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedSectionThickness",
          label: "Supplied Section Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lostDepth", label: "Lost Depth", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cryosectionCurlLossDepthTermTool.execute;
export default cryosectionCurlLossDepthTermTool;
