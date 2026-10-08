import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly mode: string };
export type Output = { readonly objectKind: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mode: {
      type: "string",
      maxLength: 8192,
      enum: ["040000", "100644", "100755", "120000", "160000"],
    },
  },
  required: ["mode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { objectKind: { type: "string", maxLength: 8192 } },
  required: ["objectKind"],
} as const;
/** Classify canonical Git tree entry mode strings into tree, blob, or submodule commit object kinds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mode } = request;
  const compute = (): Output => {
    H.domain(
      ["040000", "100644", "100755", "120000", "160000"].includes(mode),
      "mode",
    );
    return {
      objectKind:
        mode === "040000" ? "tree" : mode === "160000" ? "commit" : "blob",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mode: "100755" },
  output: { objectKind: "blob" },
} satisfies ToolExample<Input, Output>;
export const gitTreeModeObjectKindTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["development", "software development", "computer science"],
      keywords: ["software development", "computer science"],
    },
    id: "development/git-tree-mode-object-kind",
    title: "Git Tree Mode Object Kind",
    description:
      "Classify canonical Git tree entry mode strings into tree, blob, or submodule commit object kinds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mode: {
          type: "string",
          maxLength: 8192,
          enum: ["040000", "100644", "100755", "120000", "160000"],
        },
      },
      required: ["mode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { objectKind: { type: "string", maxLength: 8192 } },
      required: ["objectKind"],
    },
    ports: {
      inputs: [
        {
          id: "mode",
          label: "Mode",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "objectKind",
          label: "Object Kind",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = gitTreeModeObjectKindTool.execute;
export default gitTreeModeObjectKindTool;
