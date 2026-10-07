import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly permeateFlow: number;
  readonly feedFlow: number;
};
export type Output = {
  readonly stageCut: number;
  readonly retentateFlow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    permeateFlow: { type: "number", minimum: 0 },
    feedFlow: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["permeateFlow", "feedFlow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stageCut: { type: "number" },
    retentateFlow: { type: "number" },
  },
  required: ["stageCut", "retentateFlow"],
} as const;
/** Calculate single-pass membrane stage cut and retentate from explicit compatible feed and permeate flows. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { permeateFlow, feedFlow } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(feedFlow) && feedFlow > 0, "feedFlow"), feedFlow);
    H.domain(permeateFlow >= 0 && permeateFlow <= feedFlow, "permeateFlow");
    return {
      stageCut: permeateFlow / feedFlow,
      retentateFlow: feedFlow - permeateFlow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { permeateFlow: 20, feedFlow: 80 },
  output: { stageCut: 0.25, retentateFlow: 60 },
} satisfies ToolExample<Input, Output>;
export const membraneStageCutSinglePassTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["chemical-engineering", "chemical engineering", "engineering"],
      keywords: ["chemical engineering", "engineering"],
    },
    id: "chemical-engineering/membrane-stage-cut-single-pass",
    title: "Membrane Stage Cut Single Pass",
    description:
      "Calculate single-pass membrane stage cut and retentate from explicit compatible feed and permeate flows.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        permeateFlow: { type: "number", minimum: 0 },
        feedFlow: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["permeateFlow", "feedFlow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stageCut: { type: "number" },
        retentateFlow: { type: "number" },
      },
      required: ["stageCut", "retentateFlow"],
    },
    ports: {
      inputs: [
        {
          id: "permeateFlow",
          label: "Permeate Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "feedFlow",
          label: "Feed Flow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "stageCut", label: "Stage Cut", valueType: { type: "number" } },
        {
          id: "retentateFlow",
          label: "Retentate Flow",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = membraneStageCutSinglePassTool.execute;
export default membraneStageCutSinglePassTool;
