import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly anchors: readonly number[];
  readonly mapped: readonly number[];
};
export type Output = {
  readonly mappedScore: number;
  readonly interval: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    anchors: { type: "array", maxItems: 256, items: { type: "number" } },
    mapped: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["score", "anchors", "mapped"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mappedScore: { type: "number" },
    interval: { type: "integer" },
  },
  required: ["mappedScore", "interval"],
} as const;
/** Interpolate an explicit goal-anchor map without supplying a clinical scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, anchors, mapped } = request;
  const compute = (): Output => {
    H.sameLength(anchors, mapped);
    H.domain(
      anchors.length >= 2 &&
        anchors.every((x, i) => i === 0 || x > anchors[i - 1]),
      "anchors",
    );
    H.domain(
      score >= anchors[0] && score <= anchors[anchors.length - 1],
      "score",
    );
    let interval = anchors.length - 2;
    for (let i = 0; i < anchors.length - 1; i++)
      if (score <= anchors[i + 1]) {
        interval = i;
        break;
      }
    const w =
      (score - anchors[interval]) / (anchors[interval + 1] - anchors[interval]);
    return {
      mappedScore: mapped[interval] * (1 - w) + mapped[interval + 1] * w,
      interval,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { score: 1, anchors: [0, 2, 4], mapped: [0, 10, 30] },
  output: { mappedScore: 5, interval: 0 },
} satisfies ToolExample<Input, Output>;
export const rehabilitationGoalAttainmentAnchorMapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physiotherapy/rehabilitation-goal-attainment-anchor-map",
      title: "Rehabilitation Goal Attainment Anchor Map Tool",
      description:
        "Interpolate an explicit goal-anchor map without supplying a clinical scale.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          score: { type: "number" },
          anchors: { type: "array", maxItems: 256, items: { type: "number" } },
          mapped: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["score", "anchors", "mapped"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mappedScore: { type: "number" },
          interval: { type: "integer" },
        },
        required: ["mappedScore", "interval"],
      },
      ports: {
        inputs: [
          {
            id: "score",
            label: "Score",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "anchors",
            label: "Anchors",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "mapped",
            label: "Mapped",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "mappedScore",
            label: "Mapped Score",
            valueType: { type: "number" },
          },
          { id: "interval", label: "Interval", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = rehabilitationGoalAttainmentAnchorMapTool.execute;
export default rehabilitationGoalAttainmentAnchorMapTool;
