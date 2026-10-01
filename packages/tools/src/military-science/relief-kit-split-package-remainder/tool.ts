import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packages: number;
  readonly contentsEach: number;
  readonly kitSize: number;
  readonly reserved: number;
};
export type Output = {
  readonly completeKits: number;
  readonly remainder: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packages: { type: "integer", minimum: 0 },
    contentsEach: { type: "integer", minimum: 1 },
    kitSize: { type: "integer", minimum: 1 },
    reserved: { type: "integer", minimum: 0 },
  },
  required: ["packages", "contentsEach", "kitSize", "reserved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completeKits: { type: "integer" },
    remainder: { type: "integer" },
  },
  required: ["completeKits", "remainder"],
} as const;
/** Count complete relief kits from supplied package inventories. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packages, contentsEach, kitSize, reserved } = request;
  const compute = (): Output => {
    H.integer(packages, 0);
    H.integer(contentsEach, 1);
    H.integer(kitSize, 1);
    H.integer(reserved, 0);
    H.domain(
      Number.isSafeInteger(packages * contentsEach) &&
        reserved <= packages * contentsEach,
    );
    return {
      completeKits: Math.floor((packages * contentsEach - reserved) / kitSize),
      remainder: (packages * contentsEach - reserved) % kitSize,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { packages: 10, contentsEach: 12, kitSize: 7, reserved: 1 },
  output: { completeKits: 17, remainder: 0 },
} satisfies ToolExample<Input, Output>;
export const reliefKitSplitPackageRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/relief-kit-split-package-remainder",
    title: "Relief Kit Split Package Remainder Tool",
    description:
      "Count complete relief kits from supplied package inventories.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packages: { type: "integer", minimum: 0 },
        contentsEach: { type: "integer", minimum: 1 },
        kitSize: { type: "integer", minimum: 1 },
        reserved: { type: "integer", minimum: 0 },
      },
      required: ["packages", "contentsEach", "kitSize", "reserved"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completeKits: { type: "integer" },
        remainder: { type: "integer" },
      },
      required: ["completeKits", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "packages",
          label: "Packages",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "contentsEach",
          label: "Contents Each",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "kitSize",
          label: "Kit Size",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reserved",
          label: "Reserved",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "completeKits",
          label: "Complete Kits",
          valueType: { type: "integer" },
        },
        { id: "remainder", label: "Remainder", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = reliefKitSplitPackageRemainderTool.execute;
export default reliefKitSplitPackageRemainderTool;
