import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly toothCode: string;
  readonly suppliedSiteOrder: readonly string[];
  readonly zeroBasedSiteIndex: number;
};
export type Output = { readonly token: string; readonly siteLabel: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    toothCode: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSiteOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    zeroBasedSiteIndex: { type: "integer", minimum: 0, maximum: 5 },
  },
  required: ["toothCode", "suppliedSiteOrder", "zeroBasedSiteIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    siteLabel: { type: "string", maxLength: 8192 },
  },
  required: ["token", "siteLabel"],
} as const;
/** Select a site label from an explicitly supplied six-site tooth chart order without choosing a chart convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { toothCode, suppliedSiteOrder, zeroBasedSiteIndex } = request;
  const compute = (): Output => {
    H.domain(toothCode.length > 0, "toothCode");
    H.domain(
      suppliedSiteOrder.length === 6 &&
        new Set(suppliedSiteOrder).size === 6 &&
        suppliedSiteOrder.every((x) => x.length > 0),
      "suppliedSiteOrder",
    );
    (H.domain(
      Number.isSafeInteger(zeroBasedSiteIndex) &&
        zeroBasedSiteIndex >= 0 &&
        zeroBasedSiteIndex <= 5,
      "zeroBasedSiteIndex",
    ),
      zeroBasedSiteIndex);
    return {
      token: JSON.stringify([toothCode, suppliedSiteOrder[zeroBasedSiteIndex]]),
      siteLabel: suppliedSiteOrder[zeroBasedSiteIndex],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    toothCode: "T17",
    suppliedSiteOrder: ["A", "B", "C", "D", "E", "F"],
    zeroBasedSiteIndex: 2,
  },
  output: { token: '["T17","C"]', siteLabel: "C" },
} satisfies ToolExample<Input, Output>;
export const periodontalSixSitePositionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["periodontology", "health and medicine"],
      keywords: ["periodontology", "health and medicine"],
    },
    id: "periodontology/periodontal-six-site-position-token",
    title: "Periodontal Six Site Position Token",
    description:
      "Select a site label from an explicitly supplied six-site tooth chart order without choosing a chart convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        toothCode: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedSiteOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        zeroBasedSiteIndex: { type: "integer", minimum: 0, maximum: 5 },
      },
      required: ["toothCode", "suppliedSiteOrder", "zeroBasedSiteIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        siteLabel: { type: "string", maxLength: 8192 },
      },
      required: ["token", "siteLabel"],
    },
    ports: {
      inputs: [
        {
          id: "toothCode",
          label: "Tooth Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSiteOrder",
          label: "Supplied Site Order",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "zeroBasedSiteIndex",
          label: "Zero Based Site Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "token", label: "Token", valueType: { type: "string" } },
        { id: "siteLabel", label: "Site Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = periodontalSixSitePositionTokenTool.execute;
export default periodontalSixSitePositionTokenTool;
