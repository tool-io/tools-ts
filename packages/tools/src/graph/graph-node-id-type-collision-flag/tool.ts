import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  parseJson,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly leftJson: string; readonly rightJson: string };
export type Output = {
  readonly sameSerializedText: boolean;
  readonly typedEqual: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftJson: { type: "string", maxLength: 8192 },
    rightJson: { type: "string", maxLength: 8192 },
  },
  required: ["leftJson", "rightJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameSerializedText: { type: "boolean" },
    typedEqual: { type: "boolean" },
  },
  required: ["sameSerializedText", "typedEqual"],
} as const;
/** Compute graph node id type collision flag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { leftJson, rightJson } = input;
  const compute = (): Output => {
    const a = parseJson(leftJson),
      b = parseJson(rightJson);
    domain(
      ["number", "string"].includes(typeof a) &&
        ["number", "string"].includes(typeof b),
    );
    return { sameSerializedText: String(a) === String(b), typedEqual: a === b };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leftJson: "1", rightJson: '"1"' },
  output: { sameSerializedText: true, typedEqual: false },
} satisfies ToolExample<Input, Output>;
export const graphNodeIdTypeCollisionFlagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "graph/graph-node-id-type-collision-flag",
  title: "Graph Node ID Type Collision Flag Tool",
  description:
    "Compute graph node id type collision flag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "leftJson",
        label: "Left Json",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "rightJson",
        label: "Right Json",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "sameSerializedText",
        label: "Same Serialized Text",
        valueType: { type: "boolean" },
      },
      {
        id: "typedEqual",
        label: "Typed Equal",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = graphNodeIdTypeCollisionFlagTool.execute;
export default graphNodeIdTypeCollisionFlagTool;
