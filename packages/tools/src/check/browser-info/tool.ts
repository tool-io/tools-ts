import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type BrowserDeviceType = "desktop" | "mobile" | "tablet" | "unknown";
export type BrowserEngineName = "blink" | "gecko" | "unknown" | "webkit";

export type BrowserInfoInput = {
  /** Optional client-hints override for the device classification. */
  readonly clientHintsMobile?: boolean;
  /** Optional client-hints override for the platform, such as Windows. */
  readonly clientHintsPlatform?: string;
  /** The raw user-agent string supplied by the surface. */
  readonly userAgent: string;
};

export type BrowserInfoOutput = {
  readonly browserFamily: string;
  readonly browserMajorVersion: string | null;
  readonly deviceType: BrowserDeviceType;
  readonly engineName: BrowserEngineName;
  readonly osName: string | null;
  readonly osVersion: string | null;
};

const BROWSER_MATCHERS: readonly {
  engine: BrowserEngineName;
  family: string;
  pattern: RegExp;
}[] = [
  { engine: "blink", family: "edge", pattern: /Edg(?:A|iOS)?\/(\d+)/ },
  { engine: "blink", family: "opera", pattern: /(?:OPR|Opt)\/(\d+)/ },
  {
    engine: "blink",
    family: "samsung-internet",
    pattern: /SamsungBrowser\/(\d+)/,
  },
  { engine: "blink", family: "yandex", pattern: /YaBrowser\/(\d+)/ },
  { engine: "gecko", family: "firefox", pattern: /(?:Firefox|FxiOS)\/(\d+)/ },
  {
    engine: "blink",
    family: "chrome",
    pattern: /(?:Chrome|CriOS)\/(\d+)/,
  },
  {
    engine: "webkit",
    family: "safari",
    pattern: /Version\/(\d+).*Safari/,
  },
];

const WINDOWS_VERSIONS: Readonly<Record<string, string>> = {
  "10.0": "10/11",
  "6.1": "7",
  "6.2": "8",
  "6.3": "8.1",
};

const firstMatch = (
  userAgent: string,
  pattern: RegExp,
): string | null => userAgent.match(pattern)?.[1] ?? null;

export const browserInfoInputSchema = {
  additionalProperties: false,
  properties: {
    clientHintsMobile: {
      description: "Client-hints mobile flag overriding UA heuristics.",
      type: "boolean",
    },
    clientHintsPlatform: {
      description: "Client-hints platform string, such as Windows.",
      type: "string",
    },
    userAgent: {
      description: "Raw user-agent string.",
      type: "string",
    },
  },
  required: ["userAgent"],
  type: "object",
} as const;

export const browserInfoOutputSchema = {
  additionalProperties: false,
  properties: {
    browserFamily: {
      description: "Identified browser family.",
      type: "string",
    },
    browserMajorVersion: {
      anyOf: [{ type: "null" }, { type: "string" }],
      description: "Browser major version digits, when detected.",
    },
    deviceType: {
      description: "Best-effort device class for the session.",
      enum: ["desktop", "mobile", "tablet", "unknown"],
      type: "string",
    },
    engineName: {
      description: "Rendering engine behind the browser.",
      enum: ["blink", "gecko", "unknown", "webkit"],
      type: "string",
    },
    osName: {
      anyOf: [{ type: "null" }, { type: "string" }],
      description: "Operating system name from the user agent.",
    },
    osVersion: {
      anyOf: [{ type: "null" }, { type: "string" }],
      description: "Operating system version from the user agent.",
    },
  },
  required: [
    "browserFamily",
    "browserMajorVersion",
    "deviceType",
    "engineName",
    "osName",
    "osVersion",
  ],
  type: "object",
} as const;

export const browserInfoExample = {
  input: {
    clientHintsPlatform: "Windows",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
  },
  output: {
    browserFamily: "edge",
    browserMajorVersion: "126",
    deviceType: "desktop",
    engineName: "blink",
    osName: "windows",
    osVersion: "10/11",
  },
} satisfies ToolExample<BrowserInfoInput, BrowserInfoOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isBrowserInfoOutput = (
  value: unknown,
): value is BrowserInfoOutput =>
  isRecord(value) &&
  typeof value.browserFamily === "string" &&
  typeof value.deviceType === "string" &&
  typeof value.engineName === "string";

const detectOs = (
  userAgent: string,
): { name: string | null; version: string | null } => {
  const windowsToken = firstMatch(userAgent, /Windows NT ([\d.]+)/);
  if (windowsToken !== null)
    return {
      name: "windows",
      version: WINDOWS_VERSIONS[windowsToken] ?? windowsToken,
    };
  const androidVersion = firstMatch(userAgent, /Android (\d+(?:\.\d+)?)?/);
  if (androidVersion !== null || /\bAndroid\b/.test(userAgent))
    return { name: "android", version: androidVersion };
  const iosMatch = userAgent.match(/iPhone OS (\d+)[_\d]*/);
  if (iosMatch) return { name: "ios", version: iosMatch[1] ?? null };
  const macToken = firstMatch(userAgent, /Mac OS X ([\d_]+)/);
  if (macToken !== null)
    return {
      name: "macos",
      version: macToken.replaceAll("_", ".").split(".").slice(0, 2).join("."),
    };
  if (/CrOS\b/.test(userAgent)) return { name: "chromeos", version: null };
  if (/\bLinux\b/.test(userAgent)) return { name: "linux", version: null };
  return { name: null, version: null };
};

const detectDeviceType = (
  userAgent: string,
  hints: Pick<BrowserInfoInput, "clientHintsMobile" | "clientHintsPlatform">,
): BrowserDeviceType => {
  if (/\biPad\b/.test(userAgent)) return "tablet";
  if (/Android(?!.*Mobi)/.test(userAgent) && /\bAndroid\b/.test(userAgent))
    return "tablet";
  if (
    hints.clientHintsMobile === false &&
    hints.clientHintsPlatform !== undefined
  ) {
    const platform = hints.clientHintsPlatform.toLowerCase();
    if (platform === "macos" || platform === "windows" || platform === "linux")
      return "desktop";
  }
  if (
    hints.clientHintsMobile === true ||
    /\bMobi\b|iPhone|iPod/.test(userAgent)
  )
    return "mobile";
  if (hints.clientHintsPlatform !== undefined) {
    const platform = hints.clientHintsPlatform.toLowerCase();
    if (platform === "macos" || platform === "windows" || platform === "linux")
      return "desktop";
  }
  if (/Macintosh|Windows|CrOS|X11/.test(userAgent)) return "desktop";
  return "unknown";
};

export const calculateBrowserInfo = (
  input: unknown,
): ToolResult<BrowserInfoOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set([
    "clientHintsMobile",
    "clientHintsPlatform",
    "userAgent",
  ]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawUserAgent = input.userAgent;
  if (rawUserAgent === undefined) {
    issues.push({
      code: "user_agent_required",
      field: "userAgent",
      message: "userAgent is required.",
    });
  } else if (typeof rawUserAgent !== "string" || rawUserAgent.length > 4096) {
    issues.push({
      code: "user_agent_invalid",
      field: "userAgent",
      message: "userAgent must be a string of at most 4096 characters.",
    });
  }

  const clientHintsMobile = input.clientHintsMobile;
  if (
    clientHintsMobile !== undefined &&
    typeof clientHintsMobile !== "boolean"
  )
    issues.push({
      code: "client_hints_mobile_invalid",
      field: "clientHintsMobile",
      message: "clientHintsMobile must be a boolean.",
    });

  const clientHintsPlatform = input.clientHintsPlatform;
  if (
    clientHintsPlatform !== undefined &&
    typeof clientHintsPlatform !== "string"
  )
    issues.push({
      code: "client_hints_platform_invalid",
      field: "clientHintsPlatform",
      message: "clientHintsPlatform must be a string.",
    });

  if (issues.length > 0) return invalidInput(issues);

  const userAgent = rawUserAgent as string;
  const matcher =
    BROWSER_MATCHERS.find((candidate) => candidate.pattern.test(userAgent)) ??
    null;
  const os = detectOs(userAgent);
  const deviceType = detectDeviceType(userAgent, {
    clientHintsMobile: clientHintsMobile as boolean | undefined,
    clientHintsPlatform: clientHintsPlatform as string | undefined,
  });

  return toolSuccess({
    browserFamily: matcher?.family ?? "unknown",
    browserMajorVersion: matcher === null ? null : firstMatch(userAgent, matcher.pattern),
    deviceType,
    engineName: matcher?.engine ?? "unknown",
    osName: os.name,
    osVersion: os.version,
  });
};

export const browserInfoTool = defineTool<
  BrowserInfoInput,
  BrowserInfoOutput
>({
  contractVersion: 1,
  description:
    "Parse a user-agent probe into browser family, engine, operating system, and device type.",
  discovery: {
    aliases: ["browser-check", "ua-parser", "user-agent-info"],
    keywords: ["browser", "client", "user agent", "web"],
  },
  execute: calculateBrowserInfo,
  execution: { kind: "pure" },
  id: "check/browser-info",
  inputSchema: browserInfoInputSchema,
  outputSchema: browserInfoOutputSchema,
  ports: {
    inputs: [
      {
        description: "User-agent probe supplied by the surface.",
        id: "probe",
        label: "Browser probe",
        path: [],
        required: true,
        valueType: { format: "device-probe/browser", type: "object" },
      },
    ],
    outputs: [
      {
        description: "Identified browser family.",
        id: "browserFamily",
        label: "Browser family",
        valueType: { format: "browser-family", type: "string" },
      },
      {
        description: "Browser major version digits when detected.",
        id: "browserMajorVersion",
        label: "Browser version",
        valueType: { format: "software-version", type: "string" },
      },
      {
        description: "Rendering engine behind the browser.",
        id: "engineName",
        label: "Engine",
        valueType: { format: "browser-engine", type: "string" },
      },
      {
        description: "Operating system name from the user agent.",
        id: "osName",
        label: "Operating system",
        valueType: { format: "operating-system", type: "string" },
      },
      {
        description: "Operating system version from the user agent.",
        id: "osVersion",
        label: "OS version",
        valueType: { format: "software-version", type: "string" },
      },
      {
        description: "Best-effort device class for the session.",
        id: "deviceType",
        label: "Device type",
        valueType: { format: "device-form-factor", type: "string" },
      },
    ],
  },
  title: "Browser Info Checker",
});

export const runBrowserInfoCheck = browserInfoTool.execute;
export default browserInfoTool;
