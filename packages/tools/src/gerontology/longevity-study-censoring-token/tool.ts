import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantId: string;
  readonly observedEvent: boolean;
  readonly lostToFollowup: boolean;
  readonly administrativeEnd: boolean;
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    observedEvent: { type: "boolean" },
    lostToFollowup: { type: "boolean" },
    administrativeEnd: { type: "boolean" },
  },
  required: [
    "participantId",
    "observedEvent",
    "lostToFollowup",
    "administrativeEnd",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Encode mutually exclusive supplied longevity follow-up flags without estimating survival. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantId, observedEvent, lostToFollowup, administrativeEnd } =
    request;
  const compute = (): Output => {
    H.domain(participantId.length > 0, "participantId");
    H.domain(
      [observedEvent, lostToFollowup, administrativeEnd].filter(Boolean)
        .length <= 1,
      "observedEvent",
    );
    return {
      status: observedEvent
        ? "event"
        : lostToFollowup
          ? "lost-to-followup"
          : administrativeEnd
            ? "administratively-censored"
            : "ongoing",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participantId: "P17",
    observedEvent: false,
    lostToFollowup: true,
    administrativeEnd: false,
  },
  output: { status: "lost-to-followup" },
} satisfies ToolExample<Input, Output>;
export const longevityStudyCensoringTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gerontology", "health and medicine"],
      keywords: ["gerontology", "health and medicine"],
    },
    id: "gerontology/longevity-study-censoring-token",
    title: "Longevity Study Censoring Token",
    description:
      "Encode mutually exclusive supplied longevity follow-up flags without estimating survival.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participantId: { type: "string", maxLength: 8192, minLength: 1 },
        observedEvent: { type: "boolean" },
        lostToFollowup: { type: "boolean" },
        administrativeEnd: { type: "boolean" },
      },
      required: [
        "participantId",
        "observedEvent",
        "lostToFollowup",
        "administrativeEnd",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { status: { type: "string", maxLength: 8192 } },
      required: ["status"],
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
          id: "observedEvent",
          label: "Observed Event",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "lostToFollowup",
          label: "Lost To Followup",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "administrativeEnd",
          label: "Administrative End",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = longevityStudyCensoringTokenTool.execute;
export default longevityStudyCensoringTokenTool;
