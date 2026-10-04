import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly fixedLength: boolean;
  readonly finalField: boolean;
};
export type Output = {
  readonly separatorRequired: boolean;
  readonly separator: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fixedLength: { type: "boolean" },
    finalField: { type: "boolean" },
  },
  required: ["fixedLength", "finalField"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    separatorRequired: { type: "boolean" },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["separatorRequired", "separator"],
} as const;
/** Compute gs1 ai variable length separator flag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { fixedLength, finalField } = input;
  const compute = (): Output => {
    const separatorRequired = !fixedLength && !finalField;
    return {
      separatorRequired,
      separator: separatorRequired ? String.fromCharCode(29) : "",
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { fixedLength: false, finalField: false },
  output: { separatorRequired: true, separator: "\u001d" },
} satisfies ToolExample<Input, Output>;
export const gs1AiVariableLengthSeparatorFlagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "validate/gs1-ai-variable-length-separator-flag",
  title: "GS1 AI Variable Length Separator Flag Tool",
  description:
    "Compute gs1 ai variable length separator flag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "fixedLength",
        label: "Fixed Length",
        required: true,
        valueType: { type: "boolean" },
      },
      {
        id: "finalField",
        label: "Final Field",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      {
        id: "separatorRequired",
        label: "Separator Required",
        valueType: { type: "boolean" },
      },
      { id: "separator", label: "Separator", valueType: { type: "string" } },
    ],
  },
});
export const run = gs1AiVariableLengthSeparatorFlagTool.execute;
export default gs1AiVariableLengthSeparatorFlagTool;
