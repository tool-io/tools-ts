import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type GpuIntegration = "discrete" | "integrated" | "unknown";

export type GpuInfoInput = {
  /** Renderer string, typically from WebGL debug info. */
  readonly renderer: string;
  readonly vendor?: string;
};

export type GpuInfoOutput = {
  readonly integration: GpuIntegration;
  readonly issues: readonly string[];
  readonly modelToken: string | null;
  readonly vendor: string;
};

const VENDOR_MATCHERS: readonly { pattern: RegExp; vendor: string }[] = [
  { pattern: /nvidia|geforce|rtx|gtx/i, vendor: "nvidia" },
  { pattern: /amd|radeon|rx \d/i, vendor: "amd" },
  { pattern: /apple|m[1-4] (?:pro|max|ultra)/i, vendor: "apple" },
  { pattern: /intel|iris|uhd graphics|hd graphics/i, vendor: "intel" },
  { pattern: /adreno/i, vendor: "qualcomm" },
  { pattern: /mali/i, vendor: "arm" },
  { pattern: /powervr/i, vendor: "imagination" },
  { pattern: /swiftshader|llvmpipe/i, vendor: "software" },
];

const INTEGRATED_VENDORS = new Set(["apple", "intel", "arm", "qualcomm"]);
const DISCRETE_VENDORS = new Set(["nvidia", "amd"]);
const MODEL_PATTERN =
  /(RTX \d+(?:\s?Ti)?|GTX \d+(?:\s?Ti)?|Radeon RX \d+|Apple M\d(?: Pro| Max| Ultra)?)/i;

export const gpuInfoInputSchema = {
  additionalProperties: false,
  properties: {
    renderer: {
      description: "Renderer string reported by the surface.",
      maxLength: 512,
      minLength: 1,
      type: "string",
    },
    vendor: {
      description: "Vendor string reported by the surface.",
      maxLength: 128,
      minLength: 1,
      type: "string",
    },
  },
  required: ["renderer"],
  type: "object",
} as const;

export const gpuInfoOutputSchema = {
  additionalProperties: false,
  properties: {
    integration: {
      description: "Best-effort integrated versus discrete classification.",
      enum: ["discrete", "integrated", "unknown"],
      type: "string",
    },
    issues: {
      description: "Stable machine-facing notice codes.",
      items: { type: "string" },
      type: "array",
    },
    modelToken: {
      anyOf: [{ type: "null" }, { type: "string" }],
      description: "Matched marketing model token, when present.",
    },
    vendor: {
      description: "Classified GPU vendor.",
      type: "string",
    },
  },
  required: ["integration", "modelToken", "vendor", "issues"],
  type: "object",
} as const;

export const gpuInfoExample = {
  input: {
    renderer:
      "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0, D3D11)",
  },
  output: {
    integration: "discrete",
    issues: [],
    modelToken: "RTX 3060",
    vendor: "nvidia",
  },
} satisfies ToolExample<GpuInfoInput, GpuInfoOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isGpuInfoOutput = (value: unknown): value is GpuInfoOutput =>
  isRecord(value) &&
  typeof value.vendor === "string" &&
  typeof value.integration === "string";

const classify = (renderer: string, vendor?: string): string => {
  for (const matcher of VENDOR_MATCHERS)
    if (
      matcher.pattern.test(renderer) ||
      (vendor !== undefined && matcher.pattern.test(vendor))
    )
      return matcher.vendor;
  return "unknown";
};

export const calculateGpuInfo = (
  input: unknown,
): ToolResult<GpuInfoOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set(["renderer", "vendor"]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawRenderer = input.renderer;
  if (rawRenderer === undefined)
    return invalidInput([
      ...issues,
      {
        code: "renderer_required",
        field: "renderer",
        message: "renderer is required.",
      },
    ]);
  if (
    typeof rawRenderer !== "string" ||
    rawRenderer.trim().length < 1 ||
    rawRenderer.length > 512
  )
    return invalidInput([
      ...issues,
      {
        code: "renderer_invalid",
        field: "renderer",
        message: "renderer must be a string of 1 to 512 characters.",
      },
    ]);
  if (issues.length > 0) return invalidInput(issues);

  const rawVendor = input.vendor as string | undefined;
  const renderer = rawRenderer as string;
  const resolvedVendor = classify(renderer, rawVendor);
  const modelMatch = MODEL_PATTERN.exec(renderer);
  const outputIssues: string[] = [];
  let integration: GpuIntegration = "unknown";
  if (DISCRETE_VENDORS.has(resolvedVendor)) integration = "discrete";
  else if (INTEGRATED_VENDORS.has(resolvedVendor))
    integration = "integrated";
  else outputIssues.push("vendor-unknown");
  if (resolvedVendor === "software")
    outputIssues.push("software-renderer");

  return toolSuccess({
    integration,
    issues: outputIssues,
    modelToken: modelMatch ? modelMatch[1] : null,
    vendor: resolvedVendor,
  });
};

export const gpuInfoTool = defineTool<GpuInfoInput, GpuInfoOutput>({
  contractVersion: 1,
  description:
    "Classify a GPU probe into vendor, model token, and integrated versus discrete hints.",
  discovery: {
    aliases: ["graphics-check", "webgl-info"],
    keywords: ["gpu", "graphics", "rendering", "webgl"],
  },
  execute: calculateGpuInfo,
  execution: { kind: "pure" },
  id: "check/gpu-info",
  inputSchema: gpuInfoInputSchema,
  outputSchema: gpuInfoOutputSchema,
  ports: {
    inputs: [
      {
        description: "GPU descriptor strings from the surface.",
        id: "probe",
        label: "GPU probe",
        path: [],
        required: true,
        valueType: { format: "device-probe/gpu", type: "object" },
      },
    ],
    outputs: [
      {
        description: "Classified GPU vendor.",
        id: "vendor",
        label: "Vendor",
        valueType: { format: "gpu-vendor", type: "string" },
      },
      {
        description: "Matched marketing model token.",
        id: "modelToken",
        label: "Model",
        valueType: { format: "gpu-model", type: "string" },
      },
      {
        description: "Integrated versus discrete classification.",
        id: "integration",
        label: "Integration",
        valueType: { format: "gpu-integration", type: "string" },
      },
      {
        description: "Stable machine-facing notice codes.",
        id: "issues",
        label: "Issues",
        valueType: {
          format: "issue-codes",
          items: { type: "string" },
          type: "list",
        },
      },
    ],
  },
  title: "GPU Info Checker",
});

export const runGpuInfoCheck = gpuInfoTool.execute;
export default gpuInfoTool;
