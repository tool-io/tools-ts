import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type DeviceFormFactor =
  | "desktop"
  | "laptop"
  | "phone"
  | "tablet"
  | "unknown"
  | "watch";

export type DeviceInfoConfidence = "full" | "minimal" | "none" | "partial";
export type DevicePerformanceTier = "high" | "low" | "mid";

export type DeviceInfoInput = {
  readonly architecture?: string;
  readonly cpuCores?: number;
  readonly formFactor?: DeviceFormFactor;
  readonly memoryGb?: number;
  readonly osName?: string;
  readonly osVersion?: string;
  /** Free-form platform identifier, such as iPhone14,2 or MacPro7,1. */
  readonly platform?: string;
};

export type DeviceInfoOutput = {
  readonly architecture: string | null;
  readonly confidence: DeviceInfoConfidence;
  readonly cpuCoreTier: DevicePerformanceTier | null;
  readonly formFactor: DeviceFormFactor;
  readonly memoryTier: DevicePerformanceTier | null;
  readonly missingFields: readonly string[];
  readonly osName: string | null;
  readonly osVersion: string | null;
};

const ARCHITECTURE_ALIASES: Readonly<Record<string, string>> = {
  aarch64: "arm64",
  amd64: "x86_64",
  arm64: "arm64",
  armv7: "armv7",
  armv7l: "armv7",
  i386: "x86",
  i686: "x86",
  x64: "x86_64",
  "x86-64": "x86_64",
  x86_64: "x86_64",
};

const OS_ALIASES: Readonly<Record<string, string>> = {
  android: "android",
  chrome: "chromeos",
  cros: "chromeos",
  ios: "ios",
  ipados: "ipados",
  linux: "linux",
  mac: "macos",
  "mac os": "macos",
  macintosh: "macos",
  macos: "macos",
  "os x": "macos",
  windows: "windows",
  win32: "windows",
};

const FORM_FACTOR_HINTS: readonly [RegExp, DeviceFormFactor][] = [
  [/iphone|ipod/, "phone"],
  [/ipad|tablet/, "tablet"],
  [/watch/, "watch"],
];

const DESKTOP_HINT = /mac|windows|linux|cros/;

const CORE_TIERS: readonly [number, DevicePerformanceTier][] = [
  [3, "low"],
  [9, "mid"],
];

export const deviceInfoInputSchema = {
  additionalProperties: false,
  properties: {
    architecture: {
      description: "CPU architecture identifier, such as arm64 or x86_64.",
      type: "string",
    },
    cpuCores: {
      description: "Number of logical CPU cores.",
      minimum: 1,
      type: "integer",
    },
    formFactor: {
      description: "Physical device class when the surface knows it.",
      enum: ["desktop", "laptop", "phone", "tablet", "unknown", "watch"],
      type: "string",
    },
    memoryGb: {
      description: "Approximate device memory in gibibytes.",
      exclusiveMinimum: 0,
      type: "number",
    },
    osName: {
      description: "Operating system name reported by the surface.",
      type: "string",
    },
    osVersion: {
      description: "Operating system version reported by the surface.",
      type: "string",
    },
    platform: {
      description: "Free-form platform identifier from the surface.",
      type: "string",
    },
  },
  type: "object",
} as const;

export const deviceInfoOutputSchema = {
  additionalProperties: false,
  properties: {
    architecture: {
      anyOf: [{ type: "null" }, { type: "string" }],
      description: "Canonicalized architecture identifier.",
    },
    confidence: {
      description: "How completely the probe identifies the device.",
      enum: ["full", "minimal", "none", "partial"],
      type: "string",
    },
    cpuCoreTier: {
      anyOf: [
        { type: "null" },
        { enum: ["high", "low", "mid"], type: "string" },
      ],
      description: "Logical core count classification.",
    },
    formFactor: {
      description:
        "Explicit form factor, or inferred from platform and OS hints.",
      enum: ["desktop", "laptop", "phone", "tablet", "unknown", "watch"],
      type: "string",
    },
    memoryTier: {
      anyOf: [
        { type: "null" },
        { enum: ["high", "low", "mid"], type: "string" },
      ],
      description: "Memory size classification.",
    },
    missingFields: {
      description: "Core identification fields absent from the probe.",
      items: { type: "string" },
      type: "array",
    },
    osName: {
      anyOf: [{ type: "null" }, { type: "string" }],
      description: "Normalized operating system name.",
    },
    osVersion: {
      anyOf: [{ type: "null" }, { type: "string" }],
      description: "Trimmed operating system version.",
    },
  },
  required: [
    "architecture",
    "cpuCoreTier",
    "formFactor",
    "memoryTier",
    "missingFields",
    "confidence",
    "osName",
    "osVersion",
  ],
  type: "object",
} as const;

export const deviceInfoExample = {
  input: {
    architecture: "aarch64",
    cpuCores: 6,
    memoryGb: 6,
    osName: "iOS",
    osVersion: "18.5",
    platform: "iPhone14,2",
  },
  output: {
    architecture: "arm64",
    confidence: "full",
    cpuCoreTier: "mid",
    formFactor: "phone",
    memoryTier: "mid",
    missingFields: [],
    osName: "ios",
    osVersion: "18.5",
  },
} satisfies ToolExample<DeviceInfoInput, DeviceInfoOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const FORM_FACTORS = [
  "desktop",
  "laptop",
  "phone",
  "tablet",
  "unknown",
  "watch",
] as const;

const CORE_IDENTIFYING_FIELDS = [
  "architecture",
  "cpuCores",
  "memoryGb",
  "osName",
] as const;

const tierFor = (
  value: number,
  thresholds: readonly [number, DevicePerformanceTier][],
): DevicePerformanceTier => {
  for (const [threshold, tier] of thresholds)
    if (value < threshold) return tier;
  return "high";
};

export const isDeviceInfoOutput = (value: unknown): value is DeviceInfoOutput =>
  isRecord(value) &&
  typeof value.confidence === "string" &&
  typeof value.formFactor === "string" &&
  Array.isArray(value.missingFields);

export const calculateDeviceInfo = (
  input: unknown,
): ToolResult<DeviceInfoOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set([
    "architecture",
    "cpuCores",
    "formFactor",
    "memoryGb",
    "osName",
    "osVersion",
    "platform",
  ]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const stringFields = [
    ["architecture", "architecture_invalid"],
    ["osName", "os_name_invalid"],
    ["osVersion", "os_version_invalid"],
    ["platform", "platform_invalid"],
  ] as const;
  for (const [field, invalidCode] of stringFields) {
    const value = input[field];
    if (value !== undefined && (typeof value !== "string" || value.trim() === ""))
      issues.push({
        code: invalidCode,
        field,
        message: `${field} must be a non-empty string.`,
      });
  }

  const cpuCores = input.cpuCores;
  if (
    cpuCores !== undefined &&
    (!Number.isSafeInteger(cpuCores) || (cpuCores as number) < 1)
  )
    issues.push({
      code: "cpu_cores_invalid",
      field: "cpuCores",
      message: "cpuCores must be a positive integer.",
    });

  const memoryGb = input.memoryGb;
  if (
    memoryGb !== undefined &&
    (typeof memoryGb !== "number" ||
      !Number.isFinite(memoryGb) ||
      (memoryGb as number) <= 0)
  )
    issues.push({
      code: "memory_gb_invalid",
      field: "memoryGb",
      message: "memoryGb must be a positive finite number.",
    });

  const formFactor = input.formFactor;
  if (
    formFactor !== undefined &&
    !FORM_FACTORS.includes(formFactor as never)
  )
    issues.push({
      code: "form_factor_invalid",
      field: "formFactor",
      message: "formFactor must be a supported form factor.",
    });

  if (issues.length > 0) return invalidInput(issues);

  const architecture =
    input.architecture === undefined
      ? null
      : (ARCHITECTURE_ALIASES[
          String(input.architecture).trim().toLowerCase()
        ] ?? String(input.architecture).trim().toLowerCase());
  const rawOsName =
    input.osName === undefined ? null : String(input.osName).trim();
  const osName = rawOsName === null
    ? null
    : (OS_ALIASES[rawOsName.toLowerCase()] ?? rawOsName.toLowerCase());
  const osVersion =
    input.osVersion === undefined
      ? null
      : String(input.osVersion).trim();

  const explicitFormFactor = formFactor as DeviceFormFactor | undefined;
  let resolvedFormFactor: DeviceFormFactor = "unknown";
  if (explicitFormFactor !== undefined && explicitFormFactor !== "unknown") {
    resolvedFormFactor = explicitFormFactor;
  } else {
    const haystack = `${String(input.platform ?? "")} ${rawOsName ?? ""}`.toLowerCase();
    for (const [pattern, factor] of FORM_FACTOR_HINTS)
      if (pattern.test(haystack)) {
        resolvedFormFactor = factor;
        break;
      }
    if (
      resolvedFormFactor === "unknown" &&
      haystack.trim() !== "" &&
      DESKTOP_HINT.test(haystack)
    )
      resolvedFormFactor = "desktop";
  }

  const cpuCoreTier =
    cpuCores === undefined
      ? null
      : tierFor(cpuCores as number, CORE_TIERS);
  const memoryTier =
    memoryGb === undefined
      ? null
      : (memoryGb as number) < 4
        ? "low"
        : (memoryGb as number) < 8
          ? "mid"
          : "high";

  const presentFields = CORE_IDENTIFYING_FIELDS.filter(
    (field) => input[field] !== undefined,
  );
  const missingFields = CORE_IDENTIFYING_FIELDS.filter(
    (field) => input[field] === undefined,
  );
  const confidence: DeviceInfoConfidence =
    presentFields.length === CORE_IDENTIFYING_FIELDS.length
      ? "full"
      : presentFields.length >= 2
        ? "partial"
        : presentFields.length === 1
          ? "minimal"
          : "none";

  return toolSuccess({
    architecture,
    confidence,
    cpuCoreTier,
    formFactor: resolvedFormFactor,
    memoryTier,
    missingFields,
    osName,
    osVersion,
  });
};

export const deviceInfoTool = defineTool<DeviceInfoInput, DeviceInfoOutput>({
  contractVersion: 1,
  description:
    "Normalize and classify a device descriptor probe into tiers, form factor, and identification confidence.",
  discovery: {
    aliases: ["device-check", "hardware-info", "system-info"],
    keywords: ["device", "diagnostics", "hardware", "system"],
  },
  execute: calculateDeviceInfo,
  execution: { kind: "pure" },
  id: "check/device-info",
  inputSchema: deviceInfoInputSchema,
  outputSchema: deviceInfoOutputSchema,
  ports: {
    inputs: [
      {
        description: "Device descriptor probe supplied by the surface.",
        id: "probe",
        label: "Device probe",
        path: [],
        required: true,
        valueType: { format: "device-probe/info", type: "object" },
      },
    ],
    outputs: [
      {
        description: "Canonicalized architecture identifier.",
        id: "architecture",
        label: "Architecture",
        valueType: { format: "cpu-architecture", type: "string" },
      },
      {
        description: "Logical core count classification.",
        id: "cpuCoreTier",
        label: "CPU tier",
        valueType: { format: "performance-tier", type: "string" },
      },
      {
        description: "Resolved physical device class.",
        id: "formFactor",
        label: "Form factor",
        valueType: { format: "device-form-factor", type: "string" },
      },
      {
        description: "Memory size classification.",
        id: "memoryTier",
        label: "Memory tier",
        valueType: { format: "performance-tier", type: "string" },
      },
      {
        description: "How completely the probe identifies the device.",
        id: "confidence",
        label: "Confidence",
        valueType: { format: "identification-confidence", type: "string" },
      },
      {
        description: "Normalized operating system name.",
        id: "osName",
        label: "Operating system",
        valueType: { format: "operating-system", type: "string" },
      },
      {
        description: "Absent core identification fields.",
        id: "missingFields",
        label: "Missing fields",
        valueType: {
          format: "field-names",
          items: { type: "string" },
          type: "list",
        },
      },
      {
        description: "Trimmed operating system version.",
        id: "osVersion",
        label: "OS version",
        valueType: { format: "software-version", type: "string" },
      },
    ],
  },
  title: "Device Info Checker",
});

export const runDeviceInfoCheck = deviceInfoTool.execute;
export default deviceInfoTool;
