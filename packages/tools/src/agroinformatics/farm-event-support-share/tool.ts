import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventIds: readonly string[];
  readonly timestampPresent: readonly boolean[];
  readonly locationPresent: readonly boolean[];
  readonly unitKnown: readonly boolean[];
};
export type Output = {
  readonly events: number;
  readonly supportedEvents: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    timestampPresent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    locationPresent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    unitKnown: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["eventIds", "timestampPresent", "locationPresent", "unitKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    events: { type: "integer" },
    supportedEvents: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["events", "supportedEvents", "share", "defined"],
} as const;
/** Calculate farm event support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventIds, timestampPresent, locationPresent, unitKnown } = request;
  const compute = (): Output => {
    H.sameLength(eventIds, timestampPresent);
    H.sameLength(eventIds, locationPresent);
    H.sameLength(eventIds, unitKnown);
    return (() => {
      const all = new Set(eventIds),
        yes = new Set(
          eventIds.filter(
            (x, i) => timestampPresent[i] && locationPresent[i] && unitKnown[i],
          ),
        );
      return {
        events: all.size,
        supportedEvents: yes.size,
        share: all.size ? yes.size / all.size : 0,
        defined: all.size > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eventIds: ["a", "b"],
    timestampPresent: [true, true],
    locationPresent: [true, false],
    unitKnown: [true, true],
  },
  output: { events: 2, supportedEvents: 1, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const farmEventSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/farm-event-support-share",
    title: "Farm Event Support Share Tool",
    description:
      "Calculate farm event support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        timestampPresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        locationPresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        unitKnown: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: [
        "eventIds",
        "timestampPresent",
        "locationPresent",
        "unitKnown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        events: { type: "integer" },
        supportedEvents: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["events", "supportedEvents", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "eventIds",
          label: "Event Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "timestampPresent",
          label: "Timestamp Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "locationPresent",
          label: "Location Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "unitKnown",
          label: "Unit Known",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "events", label: "Events", valueType: { type: "integer" } },
        {
          id: "supportedEvents",
          label: "Supported Events",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = farmEventSupportShareTool.execute;
export default farmEventSupportShareTool;
