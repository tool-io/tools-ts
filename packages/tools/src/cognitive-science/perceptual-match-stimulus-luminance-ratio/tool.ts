import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly testLuminance: number;
  readonly referenceLuminance: number;
};
export type Output = { readonly luminanceRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    testLuminance: { type: "number", minimum: 0 },
    referenceLuminance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["testLuminance", "referenceLuminance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { luminanceRatio: { type: "number" } },
  required: ["luminanceRatio"],
} as const;
/** Divide supplied test-stimulus luminance by positive reference luminance without modeling perceptual equality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { testLuminance, referenceLuminance } = request;
  const compute = (): Output => {
    H.domain(testLuminance >= 0, "testLuminance");
    (H.domain(
      Number.isFinite(referenceLuminance) && referenceLuminance > 0,
      "referenceLuminance",
    ),
      referenceLuminance);
    return { luminanceRatio: testLuminance / referenceLuminance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { testLuminance: 40, referenceLuminance: 50 },
  output: { luminanceRatio: 0.8 },
} satisfies ToolExample<Input, Output>;
export const perceptualMatchStimulusLuminanceRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["cognitive-science", "cognitive science", "psychology"],
        keywords: ["cognitive science", "psychology"],
      },
      id: "cognitive-science/perceptual-match-stimulus-luminance-ratio",
      title: "Perceptual Match Stimulus Luminance Ratio",
      description:
        "Divide supplied test-stimulus luminance by positive reference luminance without modeling perceptual equality.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          testLuminance: { type: "number", minimum: 0 },
          referenceLuminance: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["testLuminance", "referenceLuminance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { luminanceRatio: { type: "number" } },
        required: ["luminanceRatio"],
      },
      ports: {
        inputs: [
          {
            id: "testLuminance",
            label: "Test Luminance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceLuminance",
            label: "Reference Luminance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "luminanceRatio",
            label: "Luminance Ratio",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = perceptualMatchStimulusLuminanceRatioTool.execute;
export default perceptualMatchStimulusLuminanceRatioTool;
