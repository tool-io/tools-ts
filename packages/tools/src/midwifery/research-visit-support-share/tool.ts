import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visitIds: readonly string[];
  readonly occurred: readonly boolean[];
  readonly recordComplete: readonly boolean[];
  readonly participantAuthorized: readonly boolean[];
};
export type Output = {
  readonly plannedVisits: number;
  readonly supportedVisits: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    occurred: { type: "array", maxItems: 256, items: { type: "boolean" } },
    recordComplete: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    participantAuthorized: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["visitIds", "occurred", "recordComplete", "participantAuthorized"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedVisits: { type: "integer" },
    supportedVisits: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["plannedVisits", "supportedVisits", "share", "defined"],
} as const;
/** Calculate research visit support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visitIds, occurred, recordComplete, participantAuthorized } = request;
  const compute = (): Output => {
    H.sameLength(visitIds, occurred);
    H.sameLength(visitIds, recordComplete);
    H.sameLength(visitIds, participantAuthorized);
    return (() => {
      const all = new Set(visitIds),
        yes = new Set(
          visitIds.filter(
            (x, i) =>
              occurred[i] && recordComplete[i] && participantAuthorized[i],
          ),
        );
      return {
        plannedVisits: all.size,
        supportedVisits: yes.size,
        share: all.size > 0 ? yes.size / all.size : 0,
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
    visitIds: ["a", "b"],
    occurred: [true, true],
    recordComplete: [true, false],
    participantAuthorized: [true, true],
  },
  output: { plannedVisits: 2, supportedVisits: 1, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const researchVisitSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "midwifery/research-visit-support-share",
    title: "Research Visit Support Share Tool",
    description:
      "Calculate research visit support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visitIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        occurred: { type: "array", maxItems: 256, items: { type: "boolean" } },
        recordComplete: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        participantAuthorized: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "visitIds",
        "occurred",
        "recordComplete",
        "participantAuthorized",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedVisits: { type: "integer" },
        supportedVisits: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["plannedVisits", "supportedVisits", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "visitIds",
          label: "Visit Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "occurred",
          label: "Occurred",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "recordComplete",
          label: "Record Complete",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "participantAuthorized",
          label: "Participant Authorized",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "plannedVisits",
          label: "Planned Visits",
          valueType: { type: "integer" },
        },
        {
          id: "supportedVisits",
          label: "Supported Visits",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = researchVisitSupportShareTool.execute;
export default researchVisitSupportShareTool;
