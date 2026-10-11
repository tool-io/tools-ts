import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantId: string;
  readonly episodeId: string;
  readonly startReason: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    episodeId: { type: "string", maxLength: 8192, minLength: 1 },
    startReason: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["participantId", "episodeId", "startReason"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Tag an explicit exposure episode with its supplied start reason without detecting episodes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantId, episodeId, startReason } = request;
  const compute = (): Output => {
    H.domain(participantId.length > 0, "participantId");
    H.domain(episodeId.length > 0, "episodeId");
    H.domain(startReason.length > 0, "startReason");
    return { token: JSON.stringify([participantId, episodeId, startReason]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { participantId: "P17", episodeId: "EP2", startReason: "new record" },
  output: { token: '["P17","EP2","new record"]' },
} satisfies ToolExample<Input, Output>;
export const exposureEpisodeStartTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacoepidemiology", "pharmacy"],
      keywords: ["pharmacoepidemiology", "pharmacy"],
    },
    id: "pharmacoepidemiology/exposure-episode-start-tag",
    title: "Exposure Episode Start Tag",
    description:
      "Tag an explicit exposure episode with its supplied start reason without detecting episodes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participantId: { type: "string", maxLength: 8192, minLength: 1 },
        episodeId: { type: "string", maxLength: 8192, minLength: 1 },
        startReason: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["participantId", "episodeId", "startReason"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "participantId",
          label: "Participant Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "episodeId",
          label: "Episode Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "startReason",
          label: "Start Reason",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = exposureEpisodeStartTagTool.execute;
export default exposureEpisodeStartTagTool;
