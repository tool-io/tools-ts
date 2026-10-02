import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speakerTurns: number;
  readonly totalTurns: number;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speakerTurns: { type: "integer", minimum: 0 },
    totalTurns: { type: "integer", minimum: 0 },
  },
  required: ["speakerTurns", "totalTurns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Calculate dialogue turn share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speakerTurns, totalTurns } = request;
  const compute = (): Output => {
    H.integer(totalTurns, 0);
    H.integer(speakerTurns, 0, totalTurns);
    return {
      share: totalTurns > 0 ? speakerTurns / totalTurns : 0,
      defined: totalTurns > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speakerTurns: 3, totalTurns: 12 },
  output: { share: 0.25, defined: true },
} satisfies ToolExample<Input, Output>;
export const dialogueTurnShareTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "peace-studies/dialogue-turn-share",
    title: "Dialogue Turn Share Tool",
    description:
      "Calculate dialogue turn share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speakerTurns: { type: "integer", minimum: 0 },
        totalTurns: { type: "integer", minimum: 0 },
      },
      required: ["speakerTurns", "totalTurns"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "speakerTurns",
          label: "Speaker Turns",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalTurns",
          label: "Total Turns",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = dialogueTurnShareTool.execute;
export default dialogueTurnShareTool;
