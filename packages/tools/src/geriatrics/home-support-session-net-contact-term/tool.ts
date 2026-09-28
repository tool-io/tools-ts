import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionMinutes: number;
  readonly travelMinutes: number;
  readonly documentationMinutes: number;
  readonly simultaneousExcludedMinutes: number;
};
export type Output = {
  readonly netContactMinutes: number;
  readonly contactShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionMinutes: { type: "number", exclusiveMinimum: 0 },
    travelMinutes: { type: "number", minimum: 0 },
    documentationMinutes: { type: "number", minimum: 0 },
    simultaneousExcludedMinutes: { type: "number", minimum: 0 },
  },
  required: [
    "sessionMinutes",
    "travelMinutes",
    "documentationMinutes",
    "simultaneousExcludedMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netContactMinutes: { type: "number" },
    contactShare: { type: "number" },
  },
  required: ["netContactMinutes", "contactShare"],
} as const;
/** Net session time excludes the union of supplied travel and documentation intervals, using an explicit overlap correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sessionMinutes,
    travelMinutes,
    documentationMinutes,
    simultaneousExcludedMinutes,
  } = request;
  const compute = (): Output => {
    H.positive(sessionMinutes);
    H.domain(
      travelMinutes >= 0 &&
        documentationMinutes >= 0 &&
        simultaneousExcludedMinutes >= 0 &&
        simultaneousExcludedMinutes <=
          Math.min(travelMinutes, documentationMinutes) &&
        travelMinutes + documentationMinutes - simultaneousExcludedMinutes <=
          sessionMinutes,
    );
    return {
      netContactMinutes:
        sessionMinutes -
        travelMinutes -
        documentationMinutes +
        simultaneousExcludedMinutes,
      contactShare:
        (sessionMinutes -
          travelMinutes -
          documentationMinutes +
          simultaneousExcludedMinutes) /
        sessionMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sessionMinutes: 120,
    travelMinutes: 30,
    documentationMinutes: 20,
    simultaneousExcludedMinutes: 10,
  },
  output: { netContactMinutes: 80, contactShare: 0.6666666666666666 },
} satisfies ToolExample<Input, Output>;
export const homeSupportSessionNetContactTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/home-support-session-net-contact-term",
    title: "Home Support Session Net Contact Term Tool",
    description:
      "Net session time excludes the union of supplied travel and documentation intervals, using an explicit overlap correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sessionMinutes: { type: "number", exclusiveMinimum: 0 },
        travelMinutes: { type: "number", minimum: 0 },
        documentationMinutes: { type: "number", minimum: 0 },
        simultaneousExcludedMinutes: { type: "number", minimum: 0 },
      },
      required: [
        "sessionMinutes",
        "travelMinutes",
        "documentationMinutes",
        "simultaneousExcludedMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netContactMinutes: { type: "number" },
        contactShare: { type: "number" },
      },
      required: ["netContactMinutes", "contactShare"],
    },
    ports: {
      inputs: [
        {
          id: "sessionMinutes",
          label: "Session Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "travelMinutes",
          label: "Travel Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "documentationMinutes",
          label: "Documentation Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "simultaneousExcludedMinutes",
          label: "Simultaneous Excluded Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
      ],
      outputs: [
        {
          id: "netContactMinutes",
          label: "Net Contact Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "contactShare",
          label: "Contact Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = homeSupportSessionNetContactTermTool.execute;
export default homeSupportSessionNetContactTermTool;
