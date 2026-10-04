import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frontageLengths: readonly number[];
  readonly accessible: readonly boolean[];
  readonly publicUse: readonly boolean[];
};
export type Output = {
  readonly totalFrontage: number;
  readonly accessiblePublicFrontage: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frontageLengths: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    accessible: { type: "array", maxItems: 256, items: { type: "boolean" } },
    publicUse: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["frontageLengths", "accessible", "publicUse"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalFrontage: { type: "number" },
    accessiblePublicFrontage: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["totalFrontage", "accessiblePublicFrontage", "share", "defined"],
} as const;
/** Calculate public space frontage access share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frontageLengths, accessible, publicUse } = request;
  const compute = (): Output => {
    H.sameLength(frontageLengths, accessible);
    H.sameLength(accessible, publicUse);
    H.domain(frontageLengths.every((x) => x >= 0));
    return (() => {
      const totalFrontage = frontageLengths.reduce((a, b) => a + b, 0),
        accessiblePublicFrontage = frontageLengths.reduce(
          (s, x, i) => s + (accessible[i] && publicUse[i] ? x : 0),
          0,
        );
      return {
        totalFrontage,
        accessiblePublicFrontage,
        share: totalFrontage > 0 ? accessiblePublicFrontage / totalFrontage : 0,
        defined: totalFrontage > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    frontageLengths: [10, 20, 30],
    accessible: [true, true, false],
    publicUse: [true, false, true],
  },
  output: {
    totalFrontage: 60,
    accessiblePublicFrontage: 10,
    share: 0.16666666666666666,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const publicSpaceFrontageAccessShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/public-space-frontage-access-share",
    title: "Public Space Frontage Access Share Tool",
    description:
      "Calculate public space frontage access share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frontageLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        accessible: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        publicUse: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["frontageLengths", "accessible", "publicUse"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalFrontage: { type: "number" },
        accessiblePublicFrontage: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "totalFrontage",
        "accessiblePublicFrontage",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "frontageLengths",
          label: "Frontage Lengths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "accessible",
          label: "Accessible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "publicUse",
          label: "Public Use",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "totalFrontage",
          label: "Total Frontage",
          valueType: { type: "number" },
        },
        {
          id: "accessiblePublicFrontage",
          label: "Accessible Public Frontage",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = publicSpaceFrontageAccessShareTool.execute;
export default publicSpaceFrontageAccessShareTool;
