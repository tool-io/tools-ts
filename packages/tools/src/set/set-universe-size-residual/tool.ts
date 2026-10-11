import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly declaredUniverseSize: number;
  readonly observedUniqueSize: number;
};
export type Output = {
  readonly unusedCapacity: number;
  readonly exceedsDeclaredUniverse: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    declaredUniverseSize: { type: "integer", minimum: 0 },
    observedUniqueSize: { type: "integer", minimum: 0 },
  },
  required: ["declaredUniverseSize", "observedUniqueSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unusedCapacity: { type: "integer" },
    exceedsDeclaredUniverse: { type: "boolean" },
  },
  required: ["unusedCapacity", "exceedsDeclaredUniverse"],
} as const;
/** Compare an explicit unique-item count with declared universe size without asserting actual set membership. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { declaredUniverseSize, observedUniqueSize } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(declaredUniverseSize) &&
        declaredUniverseSize >= 0 &&
        declaredUniverseSize <= Number.MAX_SAFE_INTEGER,
      "declaredUniverseSize",
    ),
      declaredUniverseSize);
    (H.domain(
      Number.isSafeInteger(observedUniqueSize) &&
        observedUniqueSize >= 0 &&
        observedUniqueSize <= Number.MAX_SAFE_INTEGER,
      "observedUniqueSize",
    ),
      observedUniqueSize);
    return {
      unusedCapacity: declaredUniverseSize - observedUniqueSize,
      exceedsDeclaredUniverse: observedUniqueSize > declaredUniverseSize,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { declaredUniverseSize: 10, observedUniqueSize: 7 },
  output: { unusedCapacity: 3, exceedsDeclaredUniverse: false },
} satisfies ToolExample<Input, Output>;
export const setUniverseSizeResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["set", "mathematics"],
      keywords: ["set", "mathematics"],
    },
    id: "set/set-universe-size-residual",
    title: "Set Universe Size Residual",
    description:
      "Compare an explicit unique-item count with declared universe size without asserting actual set membership.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        declaredUniverseSize: { type: "integer", minimum: 0 },
        observedUniqueSize: { type: "integer", minimum: 0 },
      },
      required: ["declaredUniverseSize", "observedUniqueSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unusedCapacity: { type: "integer" },
        exceedsDeclaredUniverse: { type: "boolean" },
      },
      required: ["unusedCapacity", "exceedsDeclaredUniverse"],
    },
    ports: {
      inputs: [
        {
          id: "declaredUniverseSize",
          label: "Declared Universe Size",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observedUniqueSize",
          label: "Observed Unique Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "unusedCapacity",
          label: "Unused Capacity",
          valueType: { type: "integer" },
        },
        {
          id: "exceedsDeclaredUniverse",
          label: "Exceeds Declared Universe",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = setUniverseSizeResidualTool.execute;
export default setUniverseSizeResidualTool;
