import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly protocolDay: number;
  readonly amendmentDay: number;
  readonly approvalDay: number;
  readonly affectedEventDay: number;
  readonly retroactiveAllowed: boolean;
};
export type Output = {
  readonly chronology: boolean;
  readonly approvedBeforeEvent: boolean;
  readonly retroactive: boolean;
  readonly acceptableUnderFlag: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    protocolDay: { type: "integer" },
    amendmentDay: { type: "integer" },
    approvalDay: { type: "integer" },
    affectedEventDay: { type: "integer" },
    retroactiveAllowed: { type: "boolean" },
  },
  required: [
    "protocolDay",
    "amendmentDay",
    "approvalDay",
    "affectedEventDay",
    "retroactiveAllowed",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chronology: { type: "boolean" },
    approvedBeforeEvent: { type: "boolean" },
    retroactive: { type: "boolean" },
    acceptableUnderFlag: { type: "boolean" },
  },
  required: [
    "chronology",
    "approvedBeforeEvent",
    "retroactive",
    "acceptableUnderFlag",
  ],
} as const;
/** Audit supplied amendment chronology with an explicit retroactivity flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    protocolDay,
    amendmentDay,
    approvalDay,
    affectedEventDay,
    retroactiveAllowed,
  } = request;
  const compute = (): Output => {
    const chronology =
        amendmentDay >= protocolDay && approvalDay >= amendmentDay,
      approvedBeforeEvent = approvalDay <= affectedEventDay,
      retroactive = approvalDay > affectedEventDay;
    return {
      chronology,
      approvedBeforeEvent,
      retroactive,
      acceptableUnderFlag:
        chronology && (approvedBeforeEvent || retroactiveAllowed),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    protocolDay: 100,
    amendmentDay: 110,
    approvalDay: 112,
    affectedEventDay: 120,
    retroactiveAllowed: false,
  },
  output: {
    chronology: true,
    approvedBeforeEvent: true,
    retroactive: false,
    acceptableUnderFlag: true,
  },
} satisfies ToolExample<Input, Output>;
export const glpProtocolAmendmentChronologyPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/glp-protocol-amendment-chronology-pair",
    title: "GLP Protocol Amendment Chronology Pair Tool",
    description:
      "Audit supplied amendment chronology with an explicit retroactivity flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        protocolDay: { type: "integer" },
        amendmentDay: { type: "integer" },
        approvalDay: { type: "integer" },
        affectedEventDay: { type: "integer" },
        retroactiveAllowed: { type: "boolean" },
      },
      required: [
        "protocolDay",
        "amendmentDay",
        "approvalDay",
        "affectedEventDay",
        "retroactiveAllowed",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chronology: { type: "boolean" },
        approvedBeforeEvent: { type: "boolean" },
        retroactive: { type: "boolean" },
        acceptableUnderFlag: { type: "boolean" },
      },
      required: [
        "chronology",
        "approvedBeforeEvent",
        "retroactive",
        "acceptableUnderFlag",
      ],
    },
    ports: {
      inputs: [
        {
          id: "protocolDay",
          label: "Protocol Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "amendmentDay",
          label: "Amendment Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "approvalDay",
          label: "Approval Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "affectedEventDay",
          label: "Affected Event Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "retroactiveAllowed",
          label: "Retroactive Allowed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "chronology",
          label: "Chronology",
          valueType: { type: "boolean" },
        },
        {
          id: "approvedBeforeEvent",
          label: "Approved Before Event",
          valueType: { type: "boolean" },
        },
        {
          id: "retroactive",
          label: "Retroactive",
          valueType: { type: "boolean" },
        },
        {
          id: "acceptableUnderFlag",
          label: "Acceptable Under Flag",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = glpProtocolAmendmentChronologyPairTool.execute;
export default glpProtocolAmendmentChronologyPairTool;
