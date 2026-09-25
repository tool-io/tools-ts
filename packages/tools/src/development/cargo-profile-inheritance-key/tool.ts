import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly profile: string; readonly inherits: string };
export type Output = {
  readonly customProfile: boolean;
  readonly inheritanceRequired: boolean;
  readonly builtInParent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    profile: { type: "string", maxLength: 8192 },
    inherits: { type: "string", maxLength: 8192 },
  },
  required: ["profile", "inherits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    customProfile: { type: "boolean" },
    inheritanceRequired: { type: "boolean" },
    builtInParent: { type: "boolean" },
  },
  required: ["customProfile", "inheritanceRequired", "builtInParent"],
} as const;
/** Classify supplied Cargo profile names; this does not resolve a manifest inheritance graph. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { profile, inherits } = request;
  const compute = (): Output => {
    const builtIns = ["dev", "release", "test", "bench"];
    H.domain(profile.length > 0 && inherits.length > 0);
    const customProfile = !builtIns.includes(profile);
    return {
      customProfile,
      inheritanceRequired: customProfile,
      builtInParent: ["dev", "release"].includes(inherits),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { profile: "production", inherits: "release" },
  output: {
    customProfile: true,
    inheritanceRequired: true,
    builtInParent: true,
  },
} satisfies ToolExample<Input, Output>;
export const cargoProfileInheritanceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/cargo-profile-inheritance-key",
    title: "Cargo Profile Inheritance Key Tool",
    description:
      "Classify supplied Cargo profile names; this does not resolve a manifest inheritance graph.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        profile: { type: "string", maxLength: 8192 },
        inherits: { type: "string", maxLength: 8192 },
      },
      required: ["profile", "inherits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        customProfile: { type: "boolean" },
        inheritanceRequired: { type: "boolean" },
        builtInParent: { type: "boolean" },
      },
      required: ["customProfile", "inheritanceRequired", "builtInParent"],
    },
    ports: {
      inputs: [
        {
          id: "profile",
          label: "Profile",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "inherits",
          label: "Inherits",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "customProfile",
          label: "Custom Profile",
          valueType: { type: "boolean" },
        },
        {
          id: "inheritanceRequired",
          label: "Inheritance Required",
          valueType: { type: "boolean" },
        },
        {
          id: "builtInParent",
          label: "Built In Parent",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = cargoProfileInheritanceKeyTool.execute;
export default cargoProfileInheritanceKeyTool;
