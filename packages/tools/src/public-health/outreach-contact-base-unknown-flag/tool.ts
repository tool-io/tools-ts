import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contacted: number;
  readonly notContacted: number;
  readonly unknown: number;
  readonly includeUnknown: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly contactFraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contacted: { type: "integer", minimum: 0 },
    notContacted: { type: "integer", minimum: 0 },
    unknown: { type: "integer", minimum: 0 },
    includeUnknown: { type: "boolean" },
  },
  required: ["contacted", "notContacted", "unknown", "includeUnknown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    contactFraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "contactFraction", "defined"],
} as const;
/** Audit outreach record denominators while retaining the explicit treatment of unknown contact status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contacted, notContacted, unknown, includeUnknown } = request;
  const compute = (): Output => {
    H.integer(contacted, 0);
    H.integer(notContacted, 0);
    H.integer(unknown, 0);
    return {
      denominator: contacted + notContacted + (includeUnknown ? unknown : 0),
      contactFraction:
        contacted + notContacted + (includeUnknown ? unknown : 0) > 0
          ? contacted /
            (contacted + notContacted + (includeUnknown ? unknown : 0))
          : 0,
      defined: contacted + notContacted + (includeUnknown ? unknown : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contacted: 30, notContacted: 50, unknown: 20, includeUnknown: true },
  output: { denominator: 100, contactFraction: 0.3, defined: true },
} satisfies ToolExample<Input, Output>;
export const outreachContactBaseUnknownFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-health/outreach-contact-base-unknown-flag",
    title: "Outreach Contact Base Unknown Flag Tool",
    description:
      "Audit outreach record denominators while retaining the explicit treatment of unknown contact status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contacted: { type: "integer", minimum: 0 },
        notContacted: { type: "integer", minimum: 0 },
        unknown: { type: "integer", minimum: 0 },
        includeUnknown: { type: "boolean" },
      },
      required: ["contacted", "notContacted", "unknown", "includeUnknown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        contactFraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "contactFraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "contacted",
          label: "Contacted",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "notContacted",
          label: "Not Contacted",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unknown",
          label: "Unknown",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeUnknown",
          label: "Include Unknown",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "contactFraction",
          label: "Contact Fraction",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = outreachContactBaseUnknownFlagTool.execute;
export default outreachContactBaseUnknownFlagTool;
