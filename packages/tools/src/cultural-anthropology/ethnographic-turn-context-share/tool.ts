import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly turnDurations: readonly number[];
  readonly contextRecorded: readonly boolean[];
  readonly authorized: readonly boolean[];
};
export type Output = {
  readonly authorizedDuration: number;
  readonly contextualizedDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    turnDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    contextRecorded: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    authorized: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["turnDurations", "contextRecorded", "authorized"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authorizedDuration: { type: "number" },
    contextualizedDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "authorizedDuration",
    "contextualizedDuration",
    "share",
    "defined",
  ],
} as const;
/** Calculate ethnographic turn context share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { turnDurations, contextRecorded, authorized } = request;
  const compute = (): Output => {
    H.sameLength(turnDurations, contextRecorded);
    H.sameLength(turnDurations, authorized);
    H.domain(turnDurations.every((x) => x >= 0));
    return (() => {
      const authorizedDuration = turnDurations.reduce(
          (s, x, i) => s + (authorized[i] ? x : 0),
          0,
        ),
        contextualizedDuration = turnDurations.reduce(
          (s, x, i) => s + (authorized[i] && contextRecorded[i] ? x : 0),
          0,
        );
      return {
        authorizedDuration,
        contextualizedDuration,
        share:
          authorizedDuration > 0
            ? contextualizedDuration / authorizedDuration
            : 0,
        defined: authorizedDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    turnDurations: [2, 3, 5],
    contextRecorded: [true, false, true],
    authorized: [true, true, false],
  },
  output: {
    authorizedDuration: 5,
    contextualizedDuration: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const ethnographicTurnContextShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-anthropology/ethnographic-turn-context-share",
    title: "Ethnographic Turn Context Share Tool",
    description:
      "Calculate ethnographic turn context share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        turnDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        contextRecorded: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        authorized: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["turnDurations", "contextRecorded", "authorized"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        authorizedDuration: { type: "number" },
        contextualizedDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "authorizedDuration",
        "contextualizedDuration",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "turnDurations",
          label: "Turn Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "contextRecorded",
          label: "Context Recorded",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "authorized",
          label: "Authorized",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "authorizedDuration",
          label: "Authorized Duration",
          valueType: { type: "number" },
        },
        {
          id: "contextualizedDuration",
          label: "Contextualized Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = ethnographicTurnContextShareTool.execute;
export default ethnographicTurnContextShareTool;
