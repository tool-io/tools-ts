import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lineSpeakers: readonly string[];
  readonly actorCode: string;
};
export type Output = { readonly lineCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineSpeakers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    actorCode: { type: "string", maxLength: 8192 },
  },
  required: ["lineSpeakers", "actorCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lineCount: { type: "integer" } },
  required: ["lineCount"],
} as const;
/** Count line records assigned to an explicit actor code; multiline speech segmentation is supplied by the caller. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lineSpeakers, actorCode } = request;
  const compute = (): Output => {
    H.domain(actorCode.length > 0, "actorCode");
    return { lineCount: lineSpeakers.filter((s) => s === actorCode).length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lineSpeakers: ["A", "B", "A", "C", "A"], actorCode: "A" },
  output: { lineCount: 3 },
} satisfies ToolExample<Input, Output>;
export const actorSceneLineCountTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "performing-arts/actor-scene-line-count",
      title: "Actor Scene Line Count Tool",
      description:
        "Count line records assigned to an explicit actor code; multiline speech segmentation is supplied by the caller.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lineSpeakers: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          actorCode: { type: "string", maxLength: 8192 },
        },
        required: ["lineSpeakers", "actorCode"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { lineCount: { type: "integer" } },
        required: ["lineCount"],
      },
      ports: {
        inputs: [
          {
            id: "lineSpeakers",
            label: "Line Speakers",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "actorCode",
            label: "Actor Code",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "lineCount",
            label: "Line Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = actorSceneLineCountTool.execute;
export default actorSceneLineCountTool;
