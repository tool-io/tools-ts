import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly platform: string };
export type Output = {
  readonly os: string;
  readonly architecture: string;
  readonly variant: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { platform: { type: "string", maxLength: 8192 } },
  required: ["platform"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    os: { type: "string", maxLength: 8192 },
    architecture: { type: "string", maxLength: 8192 },
    variant: { type: "string", maxLength: 8192 },
  },
  required: ["os", "architecture", "variant"],
} as const;
/** Calculate docker platform os architecture pair from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { platform } = input;
  const compute = (): Output => {
    const p = platform.split("/");
    H.domain(
      p.length >= 2 &&
        p.length <= 3 &&
        p.every((x) => /^[a-z0-9][a-z0-9_.-]*(?![\s\S])/.test(x)),
    );
    return { os: p[0], architecture: p[1], variant: p[2] ?? "" };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { platform: "linux/arm/v7" },
  output: { os: "linux", architecture: "arm", variant: "v7" },
} satisfies ToolExample<Input, Output>;
export const dockerPlatformOsArchitecturePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/docker-platform-os-architecture-pair",
    title: "Docker Platform Os Architecture Pair Tool",
    description:
      "Calculate docker platform os architecture pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { platform: { type: "string", maxLength: 8192 } },
      required: ["platform"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        os: { type: "string", maxLength: 8192 },
        architecture: { type: "string", maxLength: 8192 },
        variant: { type: "string", maxLength: 8192 },
      },
      required: ["os", "architecture", "variant"],
    },
    ports: {
      inputs: [
        {
          id: "platform",
          label: "Platform",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "os", label: "Os", valueType: { type: "string" } },
        {
          id: "architecture",
          label: "Architecture",
          valueType: { type: "string" },
        },
        { id: "variant", label: "Variant", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = dockerPlatformOsArchitecturePairTool.execute;
export default dockerPlatformOsArchitecturePairTool;
