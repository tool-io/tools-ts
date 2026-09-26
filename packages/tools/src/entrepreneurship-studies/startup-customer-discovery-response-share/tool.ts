import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contacted: number;
  readonly responded: number;
  readonly problemConfirmed: number;
};
export type Output = {
  readonly responseFraction: number;
  readonly confirmationAmongResponses: number;
  readonly confirmationAmongContacts: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contacted: { type: "integer", minimum: 1 },
    responded: { type: "integer", minimum: 1 },
    problemConfirmed: { type: "integer", minimum: 0 },
  },
  required: ["contacted", "responded", "problemConfirmed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseFraction: { type: "number" },
    confirmationAmongResponses: { type: "number" },
    confirmationAmongContacts: { type: "number" },
  },
  required: [
    "responseFraction",
    "confirmationAmongResponses",
    "confirmationAmongContacts",
  ],
} as const;
/** Descriptive interview funnel shares; the respondents are not assumed representative of a market. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contacted, responded, problemConfirmed } = request;
  const compute = (): Output => {
    H.integer(contacted, 1);
    H.integer(responded, 1, contacted);
    H.integer(problemConfirmed, 0, responded);
    return {
      responseFraction: responded / contacted,
      confirmationAmongResponses: problemConfirmed / responded,
      confirmationAmongContacts: problemConfirmed / contacted,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contacted: 100, responded: 40, problemConfirmed: 30 },
  output: {
    responseFraction: 0.4,
    confirmationAmongResponses: 0.75,
    confirmationAmongContacts: 0.3,
  },
} satisfies ToolExample<Input, Output>;
export const startupCustomerDiscoveryResponseShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "entrepreneurship-studies/startup-customer-discovery-response-share",
      title: "Startup Customer Discovery Response Share Tool",
      description:
        "Descriptive interview funnel shares; the respondents are not assumed representative of a market.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          contacted: { type: "integer", minimum: 1 },
          responded: { type: "integer", minimum: 1 },
          problemConfirmed: { type: "integer", minimum: 0 },
        },
        required: ["contacted", "responded", "problemConfirmed"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          responseFraction: { type: "number" },
          confirmationAmongResponses: { type: "number" },
          confirmationAmongContacts: { type: "number" },
        },
        required: [
          "responseFraction",
          "confirmationAmongResponses",
          "confirmationAmongContacts",
        ],
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
            id: "responded",
            label: "Responded",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "problemConfirmed",
            label: "Problem Confirmed",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "responseFraction",
            label: "Response Fraction",
            valueType: { type: "number" },
          },
          {
            id: "confirmationAmongResponses",
            label: "Confirmation Among Responses",
            valueType: { type: "number" },
          },
          {
            id: "confirmationAmongContacts",
            label: "Confirmation Among Contacts",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = startupCustomerDiscoveryResponseShareTool.execute;
export default startupCustomerDiscoveryResponseShareTool;
