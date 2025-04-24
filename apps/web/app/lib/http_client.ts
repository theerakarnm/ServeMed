import axios, {
  type AxiosInstance,
  AxiosError,
  type AxiosRequestConfig,
  HttpStatusCode,
  type ResponseType,
} from "axios";
import type { UrlBuilded } from "./url_builder";

/**
 * Options for authentication-related headers.
 */
export interface HttpClientOptions {
  token?: string;
  signature?: string;
}

/**
 * The response from a streaming call includes the binary data and the filename.
 */
export interface StreamResponse<T> {
  data: T;
  filename: string;
}

/**
 * A flexible HTTP client wrapping Axios.
 */
export class HttpClient {
  private axiosInstance: AxiosInstance;
  /**
   * A function to be called when a 401 Unauthorized error is encountered.
   * By default, it will simply redirect the browser to `/auth/sign-in` (if running
   * in the browser).
   */
  private unauthorizedHandler: () => void;

  /**
   * Create a new HTTP client.
   *
   * @param baseURL - The base URL for your API endpoints.
   * @param unauthorizedHandler - Optional callback triggered on 401 responses.
   * @param defaultConfig - Additional default config for axios.
   */
  constructor(
    baseURL: UrlBuilded,
    unauthorizedHandler?: () => void,
    defaultConfig?: AxiosRequestConfig
  ) {
    this.axiosInstance = axios.create({
      baseURL,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      ...defaultConfig,
    });

    // If an unauthorized handler is not provided, fallback to a default behavior.
    this.unauthorizedHandler =
      unauthorizedHandler ||
      (() => {
        if (typeof window !== "undefined") {
          // Default redirect for web applications.
          window.location.href = "/auth/sign-in";
        }
      });
  }

  /**
   * Helper to build authorization and custom signature headers.
   */
  private buildHeaders(options?: HttpClientOptions): Record<string, string> {
    const headers: Record<string, string> = {};
    if (options?.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }
    if (options?.signature) {
      headers["x-internal-signature"] = options.signature;
    }
    return headers;
  }

  /**
   * Common request handler for non-stream requests.
   */
  private async handleRequest<T>(
    config: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>(config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * A specialized handler for streaming responses.
   */
  private async handleStreamRequest<T>(
    config: AxiosRequestConfig
  ): Promise<StreamResponse<T>> {
    try {
      const response = await this.axiosInstance.request<T>(config);
      let filename = "downloaded-file.pdf"; // default filename

      // Header names are case-insensitive
      const contentDisposition =
        response.headers["content-disposition"] ||
        response.headers["Content-Disposition"];

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) {
          filename = match[1];
        }
      }

      return { data: response.data, filename };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle errors from axios.
   */
  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      console.error("HTTP Client encountered an Axios error:", error);

      const status = error.response?.status;
      if (
        status === HttpStatusCode.Unauthorized &&
        typeof window !== "undefined"
      ) {
        // Handle unauthorized errors (e.g., redirect to sign in)
        this.unauthorizedHandler();
      }
      return error;
    }

    // Wrap non-Axios errors, if any.
    return new Error(
      (error as Error)?.message || "An unknown error occurred"
    );
  }

  /**
   * Perform a GET request.
   *
   * @param url         The endpoint URL (relative or absolute).
   * @param options     (Optional) Token, signature, an AbortSignal, and extra headers.
   * @param config      (Optional) Additional axios config options.
   */
  public get<T>(
    url?: string,
    options?: HttpClientOptions & {
      signal?: AbortSignal;
      headers?: Record<string, string>;
    },
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.handleRequest<T>({
      method: "GET",
      url,
      signal: options?.signal,
      headers: {
        ...this.buildHeaders(options),
        ...options?.headers,
      },
      ...config,
    });
  }

  /**
   * Perform a POST request.
   */
  public post<T>(
    url: string,
    data?: unknown,
    options?: HttpClientOptions & {
      signal?: AbortSignal;
      headers?: Record<string, string>;
    },
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.handleRequest<T>({
      method: "POST",
      url,
      data,
      signal: options?.signal,
      headers: {
        ...this.buildHeaders(options),
        ...options?.headers,
      },
      ...config,
    });
  }

  /**
   * Perform a PUT request.
   */
  public put<T>(
    url: string,
    data?: unknown,
    options?: HttpClientOptions & {
      signal?: AbortSignal;
      headers?: Record<string, string>;
    },
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.handleRequest<T>({
      method: "PUT",
      url,
      data,
      signal: options?.signal,
      headers: {
        ...this.buildHeaders(options),
        ...options?.headers,
      },
      ...config,
    });
  }

  /**
   * Perform a DELETE request.
   */
  public delete<T>(
    url: string,
    options?: HttpClientOptions & {
      signal?: AbortSignal;
      headers?: Record<string, string>;
    },
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.handleRequest<T>({
      method: "DELETE",
      url,
      signal: options?.signal,
      headers: {
        ...this.buildHeaders(options),
        ...options?.headers,
      },
      ...config,
    });
  }

  /**
   * Perform a GET request that returns a stream (for binary data).
   *
   * @param url         The endpoint URL.
   * @param options     (Optional) Token, AbortSignal, headers, and responseType.
   * @param config      (Optional) Additional axios config options.
   */
  public stream<T>(
    url: string,
    options?: HttpClientOptions & {
      signal?: AbortSignal;
      headers?: Record<string, string>;
      responseType?: ResponseType;
    },
    config?: AxiosRequestConfig
  ): Promise<StreamResponse<T>> {
    return this.handleStreamRequest<T>({
      method: "GET",
      url,
      responseType: options?.responseType || "arraybuffer",
      signal: options?.signal,
      headers: {
        "Cache-Control": "no-store", // Prevent caching issues
        ...this.buildHeaders(options),
        ...options?.headers,
      },
      ...config,
    });
  }

  /**
   * A generic request method for more advanced scenarios.
   */
  public request<T>(
    config: AxiosRequestConfig,
    options?: HttpClientOptions
  ): Promise<T> {
    config.headers = { ...this.buildHeaders(options), ...config.headers };
    return this.handleRequest<T>(config);
  }
}

export default HttpClient;
