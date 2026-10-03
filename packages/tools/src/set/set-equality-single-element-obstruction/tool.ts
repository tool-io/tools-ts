import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly inFirst: boolean; readonly inSecond: boolean };
export type Output = { readonly obstruction: boolean; readonly side: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inFirst: { type: "boolean" }, inSecond: { type: "boolean" } },
  required: ["inFirst", "inSecond"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    obstruction: { type: "boolean" },
    side: { type: "string", maxLength: 8192 },
  },
  required: ["obstruction", "side"],
} as const;
/** Calculate set equality single element obstruction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inFirst, inSecond } = request;
  const compute = (): Output => {
    const obstruction = inFirst !== inSecond;
    return {
      obstruction,
      side: !obstruction ? "none" : inFirst ? "first" : "second",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inFirst: true, inSecond: false },
  output: { obstruction: true, side: "first" },
} satisfies ToolExample<Input, Output>;
export const setEqualitySingleElementObstructionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "set/set-equality-single-element-obstruction",
      title: "Set Equality Single Element Obstruction Tool",
      description:
        "Calculate set equality single element obstruction from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inFirst: { type: "boolean" },
          inSecond: { type: "boolean" },
        },
        required: ["inFirst", "inSecond"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          obstruction: { type: "boolean" },
          side: { type: "string", maxLength: 8192 },
        },
        required: ["obstruction", "side"],
      },
      ports: {
        inputs: [
          {
            id: "inFirst",
            label: "In First",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "inSecond",
            label: "In Second",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "obstruction",
            label: "Obstruction",
            valueType: { type: "boolean" },
          },
          { id: "side", label: "Side", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = setEqualitySingleElementObstructionTool.execute;
export default setEqualitySingleElementObstructionTool;
