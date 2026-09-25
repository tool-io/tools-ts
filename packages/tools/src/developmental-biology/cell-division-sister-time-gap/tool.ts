import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDivision: number;
  readonly secondDivision: number;
};
export type Output = {
  readonly signedGap: number;
  readonly absoluteGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDivision: { type: "number" },
    secondDivision: { type: "number" },
  },
  required: ["firstDivision", "secondDivision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedGap: { type: "number" },
    absoluteGap: { type: "number" },
  },
  required: ["signedGap", "absoluteGap"],
} as const;
/** Calculate cell division sister time gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDivision, secondDivision } = request;
  const compute = (): Output => {
    return {
      signedGap: secondDivision - firstDivision,
      absoluteGap: Math.abs(secondDivision - firstDivision),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDivision: 10, secondDivision: 14 },
  output: { signedGap: 4, absoluteGap: 4 },
} satisfies ToolExample<Input, Output>;
export const cellDivisionSisterTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/cell-division-sister-time-gap",
    title: "Cell Division Sister Time Gap Tool",
    description:
      "Calculate cell division sister time gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDivision: { type: "number" },
        secondDivision: { type: "number" },
      },
      required: ["firstDivision", "secondDivision"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedGap: { type: "number" },
        absoluteGap: { type: "number" },
      },
      required: ["signedGap", "absoluteGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstDivision",
          label: "First Division",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDivision",
          label: "Second Division",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
        {
          id: "absoluteGap",
          label: "Absolute Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cellDivisionSisterTimeGapTool.execute;
export default cellDivisionSisterTimeGapTool;
