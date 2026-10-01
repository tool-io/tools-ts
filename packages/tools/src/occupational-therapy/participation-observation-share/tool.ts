import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activityIds: readonly string[];
  readonly durations: readonly number[];
  readonly invited: readonly boolean[];
  readonly present: readonly boolean[];
  readonly observed: readonly boolean[];
};
export type Output = {
  readonly invitedDuration: number;
  readonly observedParticipationDuration: number;
  readonly participatingActivities: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activityIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    invited: { type: "array", maxItems: 256, items: { type: "boolean" } },
    present: { type: "array", maxItems: 256, items: { type: "boolean" } },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["activityIds", "durations", "invited", "present", "observed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invitedDuration: { type: "number" },
    observedParticipationDuration: { type: "number" },
    participatingActivities: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "invitedDuration",
    "observedParticipationDuration",
    "participatingActivities",
    "share",
    "defined",
  ],
} as const;
/** Calculate participation observation share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activityIds, durations, invited, present, observed } = request;
  const compute = (): Output => {
    H.sameLength(activityIds, durations);
    H.sameLength(activityIds, invited);
    H.sameLength(activityIds, present);
    H.sameLength(activityIds, observed);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const invitedDuration = durations.reduce(
          (s, x, i) => s + (invited[i] ? x : 0),
          0,
        ),
        observedParticipationDuration = durations.reduce(
          (s, x, i) => s + (invited[i] && present[i] && observed[i] ? x : 0),
          0,
        );
      return {
        invitedDuration,
        observedParticipationDuration,
        participatingActivities: new Set(
          activityIds.filter((x, i) => invited[i] && present[i] && observed[i]),
        ).size,
        share:
          invitedDuration > 0
            ? observedParticipationDuration / invitedDuration
            : 0,
        defined: invitedDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    activityIds: ["a", "b"],
    durations: [2, 3],
    invited: [true, true],
    present: [true, false],
    observed: [true, true],
  },
  output: {
    invitedDuration: 5,
    observedParticipationDuration: 2,
    participatingActivities: 1,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const participationObservationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-therapy/participation-observation-share",
    title: "Participation Observation Share Tool",
    description:
      "Calculate participation observation share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activityIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        invited: { type: "array", maxItems: 256, items: { type: "boolean" } },
        present: { type: "array", maxItems: 256, items: { type: "boolean" } },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["activityIds", "durations", "invited", "present", "observed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        invitedDuration: { type: "number" },
        observedParticipationDuration: { type: "number" },
        participatingActivities: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "invitedDuration",
        "observedParticipationDuration",
        "participatingActivities",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "activityIds",
          label: "Activity Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "invited",
          label: "Invited",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "present",
          label: "Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "invitedDuration",
          label: "Invited Duration",
          valueType: { type: "number" },
        },
        {
          id: "observedParticipationDuration",
          label: "Observed Participation Duration",
          valueType: { type: "number" },
        },
        {
          id: "participatingActivities",
          label: "Participating Activities",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = participationObservationShareTool.execute;
export default participationObservationShareTool;
