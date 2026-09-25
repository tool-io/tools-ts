import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly target: string };
export type Output = {
  readonly architecture: string;
  readonly vendor: string;
  readonly operatingSystem: string;
  readonly environment: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { target: { type: "string", maxLength: 8192 } },
  required: ["target"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    architecture: { type: "string", maxLength: 8192 },
    vendor: { type: "string", maxLength: 8192 },
    operatingSystem: { type: "string", maxLength: 8192 },
    environment: { type: "string", maxLength: 8192 },
  },
  required: ["architecture", "vendor", "operatingSystem", "environment"],
} as const;
/** Split a conventional three- or four-component Rust target triple; arbitrary custom target names are excluded. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { target } = input;
  const compute = (): Output => {
    const p = target.split("-");
    H.domain(
      p.length >= 3 &&
        p.length <= 4 &&
        p.every((s) => /^[a-zA-Z0-9_]+(?![\s\S])/.test(s)),
    );
    return {
      architecture: p[0],
      vendor: p[1],
      operatingSystem: p[2],
      environment: p[3] ?? "",
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { target: "x86_64-unknown-linux-gnu" },
  output: {
    architecture: "x86_64",
    vendor: "unknown",
    operatingSystem: "linux",
    environment: "gnu",
  },
} satisfies ToolExample<Input, Output>;
export const cargoTargetTripleComponentSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/cargo-target-triple-component-split",
    title: "Cargo Target Triple Component Split Tool",
    description:
      "Split a conventional three- or four-component Rust target triple; arbitrary custom target names are excluded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { target: { type: "string", maxLength: 8192 } },
      required: ["target"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        architecture: { type: "string", maxLength: 8192 },
        vendor: { type: "string", maxLength: 8192 },
        operatingSystem: { type: "string", maxLength: 8192 },
        environment: { type: "string", maxLength: 8192 },
      },
      required: ["architecture", "vendor", "operatingSystem", "environment"],
    },
    ports: {
      inputs: [
        {
          id: "target",
          label: "Target",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "architecture",
          label: "Architecture",
          valueType: { type: "string" },
        },
        { id: "vendor", label: "Vendor", valueType: { type: "string" } },
        {
          id: "operatingSystem",
          label: "Operating System",
          valueType: { type: "string" },
        },
        {
          id: "environment",
          label: "Environment",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = cargoTargetTripleComponentSplitTool.execute;
export default cargoTargetTripleComponentSplitTool;
