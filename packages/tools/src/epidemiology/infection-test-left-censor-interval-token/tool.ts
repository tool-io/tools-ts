import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly testId: string;
  readonly lowerBoundText: string;
  readonly upperBoundText: string;
  readonly suppliedCensorCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    testId: { type: "string", maxLength: 8192, minLength: 1 },
    lowerBoundText: { type: "string", maxLength: 8192, minLength: 1 },
    upperBoundText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCensorCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: [
    "testId",
    "lowerBoundText",
    "upperBoundText",
    "suppliedCensorCode",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicitly supplied infection-test timing bounds and censoring code without imputing infection time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { testId, lowerBoundText, upperBoundText, suppliedCensorCode } =
    request;
  const compute = (): Output => {
    H.domain(testId.length > 0, "testId");
    H.domain(lowerBoundText.length > 0, "lowerBoundText");
    H.domain(upperBoundText.length > 0, "upperBoundText");
    H.domain(suppliedCensorCode.length > 0, "suppliedCensorCode");
    return {
      token: JSON.stringify([
        testId,
        lowerBoundText,
        upperBoundText,
        suppliedCensorCode,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    testId: "T17",
    lowerBoundText: "unknown",
    upperBoundText: "2026-11-01",
    suppliedCensorCode: "left-censored",
  },
  output: { token: '["T17","unknown","2026-11-01","left-censored"]' },
} satisfies ToolExample<Input, Output>;
export const infectionTestLeftCensorIntervalTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epidemiology/infection-test-left-censor-interval-token",
      title: "Infection Test Left Censor Interval Token Tool",
      description:
        "Preserve explicitly supplied infection-test timing bounds and censoring code without imputing infection time.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          testId: { type: "string", maxLength: 8192, minLength: 1 },
          lowerBoundText: { type: "string", maxLength: 8192, minLength: 1 },
          upperBoundText: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedCensorCode: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: [
          "testId",
          "lowerBoundText",
          "upperBoundText",
          "suppliedCensorCode",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "testId",
            label: "Test Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "lowerBoundText",
            label: "Lower Bound Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "upperBoundText",
            label: "Upper Bound Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedCensorCode",
            label: "Supplied Censor Code",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = infectionTestLeftCensorIntervalTokenTool.execute;
export default infectionTestLeftCensorIntervalTokenTool;
