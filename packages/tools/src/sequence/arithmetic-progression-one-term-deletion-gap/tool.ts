import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly difference: number };
export type Output = { readonly bridgingGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { difference: { type: "number" } },
  required: ["difference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bridgingGap: { type: "number" } },
  required: ["bridgingGap"],
} as const;
/** Calculate arithmetic progression one term deletion gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { difference } = request;
  const compute = (): Output => {
    return { bridgingGap: 2 * difference };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { difference: 3 },
  output: { bridgingGap: 6 },
} satisfies ToolExample<Input, Output>;
export const arithmeticProgressionOneTermDeletionGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "sequence/arithmetic-progression-one-term-deletion-gap",
      title: "Arithmetic Progression One Term Deletion Gap Tool",
      description:
        "Calculate arithmetic progression one term deletion gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { difference: { type: "number" } },
        required: ["difference"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { bridgingGap: { type: "number" } },
        required: ["bridgingGap"],
      },
      ports: {
        inputs: [
          {
            id: "difference",
            label: "Difference",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "bridgingGap",
            label: "Bridging Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = arithmeticProgressionOneTermDeletionGapTool.execute;
export default arithmeticProgressionOneTermDeletionGapTool;
