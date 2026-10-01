import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caliperIds: readonly string[];
  readonly firstEndpointValid: readonly boolean[];
  readonly secondEndpointValid: readonly boolean[];
  readonly scaleVerified: readonly boolean[];
};
export type Output = {
  readonly calipers: number;
  readonly supportedCalipers: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caliperIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    firstEndpointValid: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    secondEndpointValid: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    scaleVerified: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: [
    "caliperIds",
    "firstEndpointValid",
    "secondEndpointValid",
    "scaleVerified",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calipers: { type: "integer" },
    supportedCalipers: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["calipers", "supportedCalipers", "share", "defined"],
} as const;
/** Calculate fetal image caliper support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caliperIds, firstEndpointValid, secondEndpointValid, scaleVerified } =
    request;
  const compute = (): Output => {
    H.sameLength(caliperIds, firstEndpointValid);
    H.sameLength(caliperIds, secondEndpointValid);
    H.sameLength(caliperIds, scaleVerified);
    return (() => {
      const all = new Set(caliperIds),
        yes = new Set(
          caliperIds.filter(
            (x, i) =>
              firstEndpointValid[i] &&
              secondEndpointValid[i] &&
              scaleVerified[i],
          ),
        );
      return {
        calipers: all.size,
        supportedCalipers: yes.size,
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
    caliperIds: ["a", "b"],
    firstEndpointValid: [true, true],
    secondEndpointValid: [true, false],
    scaleVerified: [true, true],
  },
  output: { calipers: 2, supportedCalipers: 1, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const fetalImageCaliperSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "obstetrics/fetal-image-caliper-support-share",
    title: "Fetal Image Caliper Support Share Tool",
    description:
      "Calculate fetal image caliper support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caliperIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        firstEndpointValid: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        secondEndpointValid: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        scaleVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "caliperIds",
        "firstEndpointValid",
        "secondEndpointValid",
        "scaleVerified",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calipers: { type: "integer" },
        supportedCalipers: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["calipers", "supportedCalipers", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "caliperIds",
          label: "Caliper Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "firstEndpointValid",
          label: "First Endpoint Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "secondEndpointValid",
          label: "Second Endpoint Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "scaleVerified",
          label: "Scale Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "calipers", label: "Calipers", valueType: { type: "integer" } },
        {
          id: "supportedCalipers",
          label: "Supported Calipers",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = fetalImageCaliperSupportShareTool.execute;
export default fetalImageCaliperSupportShareTool;
