import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly episodeStart: number;
  readonly episodeEnd: number;
  readonly excludedSeconds: number;
};
export type Output = {
  readonly wallSeconds: number;
  readonly observedSeconds: number;
  readonly excludedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    episodeStart: { type: "number" },
    episodeEnd: { type: "number" },
    excludedSeconds: { type: "number", minimum: 0 },
  },
  required: ["episodeStart", "episodeEnd", "excludedSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wallSeconds: { type: "number" },
    observedSeconds: { type: "number" },
    excludedFraction: { type: "number" },
  },
  required: ["wallSeconds", "observedSeconds", "excludedFraction"],
} as const;
/** Research observation duration accounting without attachment classification or a protocol-specific episode rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { episodeStart, episodeEnd, excludedSeconds } = request;
  const compute = (): Output => {
    H.domain(
      episodeEnd > episodeStart &&
        excludedSeconds >= 0 &&
        excludedSeconds <= episodeEnd - episodeStart,
    );
    return {
      wallSeconds: episodeEnd - episodeStart,
      observedSeconds: episodeEnd - episodeStart - excludedSeconds,
      excludedFraction: excludedSeconds / (episodeEnd - episodeStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { episodeStart: 10, episodeEnd: 190, excludedSeconds: 30 },
  output: {
    wallSeconds: 180,
    observedSeconds: 150,
    excludedFraction: 0.16666666666666666,
  },
} satisfies ToolExample<Input, Output>;
export const attachmentResearchEpisodeDurationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-psychology/attachment-research-episode-duration-term",
      title: "Attachment Research Episode Duration Term Tool",
      description:
        "Research observation duration accounting without attachment classification or a protocol-specific episode rule.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          episodeStart: { type: "number" },
          episodeEnd: { type: "number" },
          excludedSeconds: { type: "number", minimum: 0 },
        },
        required: ["episodeStart", "episodeEnd", "excludedSeconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          wallSeconds: { type: "number" },
          observedSeconds: { type: "number" },
          excludedFraction: { type: "number" },
        },
        required: ["wallSeconds", "observedSeconds", "excludedFraction"],
      },
      ports: {
        inputs: [
          {
            id: "episodeStart",
            label: "Episode Start",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "episodeEnd",
            label: "Episode End",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "excludedSeconds",
            label: "Excluded Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
        ],
        outputs: [
          {
            id: "wallSeconds",
            label: "Wall Seconds",
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "observedSeconds",
            label: "Observed Seconds",
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "excludedFraction",
            label: "Excluded Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = attachmentResearchEpisodeDurationTermTool.execute;
export default attachmentResearchEpisodeDurationTermTool;
