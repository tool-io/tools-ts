import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstFloweringEnd: number;
  readonly nextFloweringStart: number;
  readonly seasonEnd: number;
};
export type Output = { readonly gap: number; readonly withinSeasonGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstFloweringEnd: { type: "number" },
    nextFloweringStart: { type: "number" },
    seasonEnd: { type: "number" },
  },
  required: ["firstFloweringEnd", "nextFloweringStart", "seasonEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, withinSeasonGap: { type: "number" } },
  required: ["gap", "withinSeasonGap"],
} as const;
/** Calculate floral resource seasonal gap duration from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstFloweringEnd, nextFloweringStart, seasonEnd } = request;
  const compute = (): Output => {
    H.domain(firstFloweringEnd <= seasonEnd);
    return {
      gap: Math.max(0, nextFloweringStart - firstFloweringEnd),
      withinSeasonGap: Math.max(
        0,
        Math.min(nextFloweringStart, seasonEnd) - firstFloweringEnd,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstFloweringEnd: 100, nextFloweringStart: 120, seasonEnd: 150 },
  output: { gap: 20, withinSeasonGap: 20 },
} satisfies ToolExample<Input, Output>;
export const floralResourceSeasonalGapDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/floral-resource-seasonal-gap-duration",
    title: "Floral Resource Seasonal Gap Duration Tool",
    description:
      "Calculate floral resource seasonal gap duration from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstFloweringEnd: { type: "number" },
        nextFloweringStart: { type: "number" },
        seasonEnd: { type: "number" },
      },
      required: ["firstFloweringEnd", "nextFloweringStart", "seasonEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gap: { type: "number" },
        withinSeasonGap: { type: "number" },
      },
      required: ["gap", "withinSeasonGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstFloweringEnd",
          label: "First Flowering End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextFloweringStart",
          label: "Next Flowering Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "seasonEnd",
          label: "Season End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        {
          id: "withinSeasonGap",
          label: "Within Season Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = floralResourceSeasonalGapDurationTool.execute;
export default floralResourceSeasonalGapDurationTool;
