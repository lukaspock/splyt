const mockCreateClient = jest.fn((..._args: unknown[]) => ({ mocked: true }));

jest.mock("@supabase/supabase-js", () => ({
  createClient: (url: string, key: string, options: unknown) =>
    mockCreateClient(url, key, options),
}));

const mockGetItemAsync = jest.fn(async (_key: string) => "stored-value");
const mockSetItemAsync = jest.fn(async (_key: string, _value: string) => undefined);
const mockDeleteItemAsync = jest.fn(async (_key: string) => undefined);

jest.mock("expo-secure-store", () => ({
  getItemAsync: (key: string) => mockGetItemAsync(key),
  setItemAsync: (key: string, value: string) => mockSetItemAsync(key, value),
  deleteItemAsync: (key: string) => mockDeleteItemAsync(key),
}));

jest.mock("react-native-url-polyfill/auto", () => ({}));

const ORIGINAL_ENV = process.env;

describe("lib/supabase", () => {
  beforeEach(() => {
    jest.resetModules();
    mockCreateClient.mockClear();
    mockGetItemAsync.mockClear();
    mockSetItemAsync.mockClear();
    mockDeleteItemAsync.mockClear();
    process.env = {
      ...ORIGINAL_ENV,
      EXPO_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      EXPO_PUBLIC_SUPABASE_ANON_KEY: "anon-key-123",
    };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("creates the client with the URL and anon key from env vars", () => {
    require("../supabase");

    expect(mockCreateClient).toHaveBeenCalledTimes(1);
    expect(mockCreateClient).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "anon-key-123",
      expect.objectContaining({
        auth: expect.objectContaining({
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        }),
      })
    );
  });

  it("backs session storage with expo-secure-store, not plain AsyncStorage", async () => {
    require("../supabase");

    const options = mockCreateClient.mock.calls[0][2] as {
      auth: { storage: { getItem: (k: string) => unknown; setItem: (k: string, v: string) => unknown; removeItem: (k: string) => unknown } };
    };
    const storage = options.auth.storage;

    await storage.getItem("sb-session");
    expect(mockGetItemAsync).toHaveBeenCalledWith("sb-session");

    await storage.setItem("sb-session", "token-value");
    expect(mockSetItemAsync).toHaveBeenCalledWith("sb-session", "token-value");

    await storage.removeItem("sb-session");
    expect(mockDeleteItemAsync).toHaveBeenCalledWith("sb-session");
  });

  it("throws a clear error when env vars are missing", () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = "";

    expect(() => require("../supabase")).toThrow(/EXPO_PUBLIC_SUPABASE_URL/);
  });
});
