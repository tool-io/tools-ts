import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  browserInfoExample,
  browserInfoTool,
  calculateBrowserInfo,
} from "./tool.js";

const CHROME_WINDOWS =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const SAFARI_IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (Version/17.5 Mobile/15E148 Safari/604.1";
const FIREFOX_LINUX =
  "Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0";
const ANDROID_TABLET =
  "Mozilla/5.0 (Android 13; Tablet) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

const issueCodes = (result: ReturnType<typeof calculateBrowserInfo>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Browser Info Checker", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = browserInfoTool.execute(browserInfoExample.input);
    expect(result).toEqual({ ok: true, output: browserInfoExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(browserInfoTool.id).toBe("check/browser-info");
    expect(validateToolContract(browserInfoTool)).toEqual([]);
  });

  it("identifies chrome on windows", () => {
    const result = calculateBrowserInfo({ userAgent: CHROME_WINDOWS });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.browserFamily).toBe("chrome");
      expect(result.output.browserMajorVersion).toBe("126");
      expect(result.output.engineName).toBe("blink");
      expect(result.output.osName).toBe("windows");
      expect(result.output.osVersion).toBe("10/11");
      expect(result.output.deviceType).toBe("desktop");
    }
  });

  it("ranks edge above chrome when both tokens exist", () => {
    const result = calculateBrowserInfo({
      userAgent: `${CHROME_WINDOWS} Edg/126.0.0.0`,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.browserFamily).toBe("edge");
  });

  it("identifies safari on iphone as a mobile webkit device", () => {
    const result = calculateBrowserInfo({ userAgent: SAFARI_IPHONE });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.browserFamily).toBe("safari");
      expect(result.output.engineName).toBe("webkit");
      expect(result.output.osName).toBe("ios");
      expect(result.output.osVersion).toBe("17");
      expect(result.output.deviceType).toBe("mobile");
    }
  });

  it("identifies firefox on linux as gecko", () => {
    const result = calculateBrowserInfo({ userAgent: FIREFOX_LINUX });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.browserFamily).toBe("firefox");
      expect(result.output.engineName).toBe("gecko");
      expect(result.output.osName).toBe("linux");
      expect(result.output.deviceType).toBe("desktop");
    }
  });

  it("treats android without Mobi as tablet", () => {
    const result = calculateBrowserInfo({ userAgent: ANDROID_TABLET });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.deviceType).toBe("tablet");
      expect(result.output.osName).toBe("android");
      expect(result.output.osVersion).toBe("13");
    }
  });

  it("lets client hints override UA heuristics", () => {
    const desktopMobileUa = calculateBrowserInfo({
      clientHintsMobile: false,
      clientHintsPlatform: "Windows",
      userAgent:
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
    });
    expect(desktopMobileUa.ok).toBe(true);
    if (desktopMobileUa.ok)
      expect(desktopMobileUa.output.deviceType).toBe("desktop");
  });

  it("reports unknown families gracefully", () => {
    const result = calculateBrowserInfo({
      userAgent: "MysteryBot/1.0 (crawler)",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.browserFamily).toBe("unknown");
      expect(result.output.browserMajorVersion).toBeNull();
      expect(result.output.engineName).toBe("unknown");
      expect(result.output.deviceType).toBe("unknown");
    }
  });

  it("rejects malformed probes", () => {
    expect(calculateBrowserInfo(null).ok).toBe(false);
    expect(issueCodes(calculateBrowserInfo({}))).toEqual([
      "user_agent_required",
    ]);
    expect(
      issueCodes(calculateBrowserInfo({ userAgent: "ok", extra: 1 })),
    ).toEqual(["unknown_field"]);
    expect(issueCodes(calculateBrowserInfo({ userAgent: 42 }))).toEqual([
      "user_agent_invalid",
    ]);
    expect(
      issueCodes(
        calculateBrowserInfo({ clientHintsMobile: "yes", userAgent: "ok" }),
      ),
    ).toEqual(["client_hints_mobile_invalid"]);
  });
});
