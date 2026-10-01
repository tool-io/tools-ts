import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduledMinutes: number;
  readonly attendedMinutes: number;
  readonly remoteMinutes: number;
  readonly includeRemote: boolean;
};
export type Output = {
  readonly creditedMinutes: number;
  readonly attendanceFraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledMinutes: { type: "number", minimum: 0 },
    attendedMinutes: { type: "number", minimum: 0 },
    remoteMinutes: { type: "number", minimum: 0 },
    includeRemote: { type: "boolean" },
  },
  required: [
    "scheduledMinutes",
    "attendedMinutes",
    "remoteMinutes",
    "includeRemote",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditedMinutes: { type: "number" },
    attendanceFraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["creditedMinutes", "attendanceFraction", "defined"],
} as const;
/** Coverage accounting for disjoint supplied in-person and remote support minutes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduledMinutes, attendedMinutes, remoteMinutes, includeRemote } =
    request;
  const compute = (): Output => {
    H.domain(
      scheduledMinutes >= 0 &&
        attendedMinutes >= 0 &&
        remoteMinutes >= 0 &&
        attendedMinutes + remoteMinutes <= scheduledMinutes,
    );
    return {
      creditedMinutes: attendedMinutes + (includeRemote ? remoteMinutes : 0),
      attendanceFraction:
        scheduledMinutes > 0
          ? (attendedMinutes + (includeRemote ? remoteMinutes : 0)) /
            scheduledMinutes
          : 0,
      defined: scheduledMinutes > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scheduledMinutes: 100,
    attendedMinutes: 60,
    remoteMinutes: 20,
    includeRemote: true,
  },
  output: { creditedMinutes: 80, attendanceFraction: 0.8, defined: true },
} satisfies ToolExample<Input, Output>;
export const supportContactWindowBaseTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "midwifery/support-contact-window-base-token",
    title: "Support Contact Window Base Token Tool",
    description:
      "Coverage accounting for disjoint supplied in-person and remote support minutes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduledMinutes: { type: "number", minimum: 0 },
        attendedMinutes: { type: "number", minimum: 0 },
        remoteMinutes: { type: "number", minimum: 0 },
        includeRemote: { type: "boolean" },
      },
      required: [
        "scheduledMinutes",
        "attendedMinutes",
        "remoteMinutes",
        "includeRemote",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creditedMinutes: { type: "number" },
        attendanceFraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["creditedMinutes", "attendanceFraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "scheduledMinutes",
          label: "Scheduled Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "attendedMinutes",
          label: "Attended Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "remoteMinutes",
          label: "Remote Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeRemote",
          label: "Include Remote",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "creditedMinutes",
          label: "Credited Minutes",
          valueType: { type: "number" },
        },
        {
          id: "attendanceFraction",
          label: "Attendance Fraction",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = supportContactWindowBaseTokenTool.execute;
export default supportContactWindowBaseTokenTool;
