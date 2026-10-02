import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string };
export type Output = { readonly target: string; readonly content: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    target: { type: "string", maxLength: 8192 },
    content: { type: "string", maxLength: 8192 },
  },
  required: ["target", "content"],
} as const;
/** Parse a processing instruction with an ASCII XML name subset and reject the reserved XML target. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text } = request;
  const compute = (): Output => {
    const r =
      /^<\?([A-Za-z_][A-Za-z0-9_.:-]*)(?:\s+([\s\S]*?))?\?>(?![\s\S])/.exec(
        text,
      );
    H.domain(
      r !== null &&
        r[1].toLowerCase() !== "xml" &&
        !(r[2] ?? "").includes("?>"),
    );
    return { target: r[1], content: r[2] ?? "" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "<?style sheet?>" },
  output: { target: "style", content: "sheet" },
} satisfies ToolExample<Input, Output>;
export const xmlProcessingInstructionTargetTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "parse/xml-processing-instruction-target-token",
      title: "XML Processing Instruction Target Token Tool",
      description:
        "Parse a processing instruction with an ASCII XML name subset and reject the reserved XML target.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { text: { type: "string", maxLength: 8192 } },
        required: ["text"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          target: { type: "string", maxLength: 8192 },
          content: { type: "string", maxLength: 8192 },
        },
        required: ["target", "content"],
      },
      ports: {
        inputs: [
          {
            id: "text",
            label: "Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "target", label: "Target", valueType: { type: "string" } },
          { id: "content", label: "Content", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = xmlProcessingInstructionTargetTokenTool.execute;
export default xmlProcessingInstructionTargetTokenTool;
