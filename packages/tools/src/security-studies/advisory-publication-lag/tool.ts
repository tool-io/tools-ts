import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventTime: number;
  readonly publicationTime: number;
  readonly suppliedClockOffset: number;
};
export type Output = { readonly lag: number; readonly precedesEvent: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventTime: { type: "number" },
    publicationTime: { type: "number" },
    suppliedClockOffset: { type: "number" },
  },
  required: ["eventTime", "publicationTime", "suppliedClockOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lag: { type: "number" }, precedesEvent: { type: "boolean" } },
  required: ["lag", "precedesEvent"],
} as const;
/** Compare supplied public advisory timestamps without evaluating threats or recommending operational action. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventTime, publicationTime, suppliedClockOffset } = request;
  const compute = (): Output => {
    return {
      lag: publicationTime - suppliedClockOffset - eventTime,
      precedesEvent: publicationTime - suppliedClockOffset < eventTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventTime: 10, publicationTime: 30, suppliedClockOffset: 5 },
  output: { lag: 15, precedesEvent: false },
} satisfies ToolExample<Input, Output>;
export const advisoryPublicationLagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/advisory-publication-lag",
    title: "Advisory Publication Lag Tool",
    description:
      "Compare supplied public advisory timestamps without evaluating threats or recommending operational action.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventTime: { type: "number" },
        publicationTime: { type: "number" },
        suppliedClockOffset: { type: "number" },
      },
      required: ["eventTime", "publicationTime", "suppliedClockOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lag: { type: "number" },
        precedesEvent: { type: "boolean" },
      },
      required: ["lag", "precedesEvent"],
    },
    ports: {
      inputs: [
        {
          id: "eventTime",
          label: "Event Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "publicationTime",
          label: "Publication Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedClockOffset",
          label: "Supplied Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lag", label: "Lag", valueType: { type: "number" } },
        {
          id: "precedesEvent",
          label: "Precedes Event",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = advisoryPublicationLagTool.execute;
export default advisoryPublicationLagTool;
