import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly granted: number;
  readonly vested: number;
  readonly releasedUnvested: number;
  readonly repurchased: number;
};
export type Output = {
  readonly subjectToRepurchase: number;
  readonly noLongerSubject: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    granted: { type: "integer", minimum: 0 },
    vested: { type: "integer", minimum: 0 },
    releasedUnvested: { type: "integer", minimum: 0 },
    repurchased: { type: "integer", minimum: 0 },
  },
  required: ["granted", "vested", "releasedUnvested", "repurchased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subjectToRepurchase: { type: "integer" },
    noLongerSubject: { type: "integer" },
  },
  required: ["subjectToRepurchase", "noLongerSubject"],
} as const;
/** Share ledger arithmetic using explicitly supplied vested, released and repurchased amounts, not an interpretation of repurchase clauses. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { granted, vested, releasedUnvested, repurchased } = request;
  const compute = (): Output => {
    H.integer(granted, 0);
    H.integer(vested, 0);
    H.integer(releasedUnvested, 0);
    H.integer(repurchased, 0);
    H.domain(vested + releasedUnvested + repurchased <= granted);
    return {
      subjectToRepurchase: granted - vested - releasedUnvested - repurchased,
      noLongerSubject: vested + releasedUnvested,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    granted: 1000,
    vested: 400,
    releasedUnvested: 100,
    repurchased: 200,
  },
  output: { subjectToRepurchase: 300, noLongerSubject: 500 },
} satisfies ToolExample<Input, Output>;
export const founderRepurchaseRightExpiredShareTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "entrepreneurship-studies/founder-repurchase-right-expired-share-term",
      title: "Founder Repurchase Right Expired Share Term Tool",
      description:
        "Share ledger arithmetic using explicitly supplied vested, released and repurchased amounts, not an interpretation of repurchase clauses.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          granted: { type: "integer", minimum: 0 },
          vested: { type: "integer", minimum: 0 },
          releasedUnvested: { type: "integer", minimum: 0 },
          repurchased: { type: "integer", minimum: 0 },
        },
        required: ["granted", "vested", "releasedUnvested", "repurchased"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          subjectToRepurchase: { type: "integer" },
          noLongerSubject: { type: "integer" },
        },
        required: ["subjectToRepurchase", "noLongerSubject"],
      },
      ports: {
        inputs: [
          {
            id: "granted",
            label: "Granted",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "vested",
            label: "Vested",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "releasedUnvested",
            label: "Released Unvested",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "repurchased",
            label: "Repurchased",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "subjectToRepurchase",
            label: "Subject To Repurchase",
            valueType: { type: "integer" },
          },
          {
            id: "noLongerSubject",
            label: "No Longer Subject",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = founderRepurchaseRightExpiredShareTermTool.execute;
export default founderRepurchaseRightExpiredShareTermTool;
