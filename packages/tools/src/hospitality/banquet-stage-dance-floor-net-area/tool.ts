import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roomArea: number;
  readonly stageArea: number;
  readonly danceArea: number;
  readonly otherExcludedArea: number;
};
export type Output = { readonly netArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roomArea: { type: "number" },
    stageArea: { type: "number", minimum: 0 },
    danceArea: { type: "number", minimum: 0 },
    otherExcludedArea: { type: "number", minimum: 0 },
  },
  required: ["roomArea", "stageArea", "danceArea", "otherExcludedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netArea: { type: "number" } },
  required: ["netArea"],
} as const;
/** Calculate banquet stage dance floor net area from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roomArea, stageArea, danceArea, otherExcludedArea } = request;
  const compute = (): Output => {
    H.domain(
      stageArea >= 0 &&
        danceArea >= 0 &&
        otherExcludedArea >= 0 &&
        roomArea >= stageArea + danceArea + otherExcludedArea,
    );
    return { netArea: roomArea - stageArea - danceArea - otherExcludedArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { roomArea: 500, stageArea: 40, danceArea: 60, otherExcludedArea: 50 },
  output: { netArea: 350 },
} satisfies ToolExample<Input, Output>;
export const banquetStageDanceFloorNetAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/banquet-stage-dance-floor-net-area",
    title: "Banquet Stage Dance Floor Net Area Tool",
    description:
      "Calculate banquet stage dance floor net area from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roomArea: { type: "number" },
        stageArea: { type: "number", minimum: 0 },
        danceArea: { type: "number", minimum: 0 },
        otherExcludedArea: { type: "number", minimum: 0 },
      },
      required: ["roomArea", "stageArea", "danceArea", "otherExcludedArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netArea: { type: "number" } },
      required: ["netArea"],
    },
    ports: {
      inputs: [
        {
          id: "roomArea",
          label: "Room Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stageArea",
          label: "Stage Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "danceArea",
          label: "Dance Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherExcludedArea",
          label: "Other Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netArea", label: "Net Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = banquetStageDanceFloorNetAreaTool.execute;
export default banquetStageDanceFloorNetAreaTool;
