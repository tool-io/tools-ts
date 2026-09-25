import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly reference: string };
export type Output = {
  readonly image: string;
  readonly algorithm: string;
  readonly digest: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reference: { type: "string", maxLength: 8192 } },
  required: ["reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    image: { type: "string", maxLength: 8192 },
    algorithm: { type: "string", maxLength: 8192 },
    digest: { type: "string", maxLength: 8192 },
  },
  required: ["image", "algorithm", "digest"],
} as const;
/** Compute docker image digest algorithm split from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { reference } = input;
  const compute = (): Output => {
    const m =
      /^([^@\s]+)@([a-z0-9]+(?:[+._-][a-z0-9]+)*):([0-9a-fA-F]+)(?![\s\S])/.exec(
        reference,
      );
    domain(m);
    return { image: m[1], algorithm: m[2], digest: m[3] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { reference: "example/app@sha256:abcd" },
  output: { image: "example/app", algorithm: "sha256", digest: "abcd" },
} satisfies ToolExample<Input, Output>;
export const dockerImageDigestAlgorithmSplitTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "development/docker-image-digest-algorithm-split",
  title: "Docker Image Digest Algorithm Split Tool",
  description:
    "Compute docker image digest algorithm split from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "reference",
        label: "Reference",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "image", label: "Image", valueType: { type: "string" } },
      { id: "algorithm", label: "Algorithm", valueType: { type: "string" } },
      { id: "digest", label: "Digest", valueType: { type: "string" } },
    ],
  },
});
export const run = dockerImageDigestAlgorithmSplitTool.execute;
export default dockerImageDigestAlgorithmSplitTool;
