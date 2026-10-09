import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousEpisodeEnd: number;
  readonly nextEpisodeStart: number;
  readonly suppliedWashoutDuration: number;
};
export type Output = {
  readonly episodeGap: number;
  readonly meetsSuppliedWashout: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousEpisodeEnd: { type: "number" },
    nextEpisodeStart: { type: "number" },
    suppliedWashoutDuration: { type: "number", minimum: 0 },
  },
  required: [
    "previousEpisodeEnd",
    "nextEpisodeStart",
    "suppliedWashoutDuration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    episodeGap: { type: "number" },
    meetsSuppliedWashout: { type: "boolean" },
  },
  required: ["episodeGap", "meetsSuppliedWashout"],
} as const;
/** Compare an explicit interepisode time gap with a supplied inclusive washout duration without defining recurrent disease episodes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousEpisodeEnd, nextEpisodeStart, suppliedWashoutDuration } =
    request;
  const compute = (): Output => {
    H.domain(suppliedWashoutDuration >= 0, "suppliedWashoutDuration");
    return {
      episodeGap: nextEpisodeStart - previousEpisodeEnd,
      meetsSuppliedWashout:
        nextEpisodeStart - previousEpisodeEnd >= suppliedWashoutDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousEpisodeEnd: 10,
    nextEpisodeStart: 20,
    suppliedWashoutDuration: 7,
  },
  output: { episodeGap: 10, meetsSuppliedWashout: true },
} satisfies ToolExample<Input, Output>;
export const recurrentEpisodeWashoutGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/recurrent-episode-washout-gap",
    title: "Recurrent Episode Washout Gap Tool",
    description:
      "Compare an explicit interepisode time gap with a supplied inclusive washout duration without defining recurrent disease episodes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousEpisodeEnd: { type: "number" },
        nextEpisodeStart: { type: "number" },
        suppliedWashoutDuration: { type: "number", minimum: 0 },
      },
      required: [
        "previousEpisodeEnd",
        "nextEpisodeStart",
        "suppliedWashoutDuration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        episodeGap: { type: "number" },
        meetsSuppliedWashout: { type: "boolean" },
      },
      required: ["episodeGap", "meetsSuppliedWashout"],
    },
    ports: {
      inputs: [
        {
          id: "previousEpisodeEnd",
          label: "Previous Episode End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextEpisodeStart",
          label: "Next Episode Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWashoutDuration",
          label: "Supplied Washout Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "episodeGap",
          label: "Episode Gap",
          valueType: { type: "number" },
        },
        {
          id: "meetsSuppliedWashout",
          label: "Meets Supplied Washout",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = recurrentEpisodeWashoutGapTool.execute;
export default recurrentEpisodeWashoutGapTool;
