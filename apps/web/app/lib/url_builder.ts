import { API_ENDPOINT } from "../configs/api_endpoint";
import { validateQuery } from "./query";

export type RootEndpointKey = "BACKEND_ENDPOINT";

// A built URL is a concatenation of a string and one of the endpoints.
export type UrlBuilded = `${string}${(typeof API_ENDPOINT)[keyof typeof API_ENDPOINT]}`;

export class UrlBuilder {
  private baseUrl: string;
  private urlPath: string;
  private queryParams: URLSearchParams;

  /**
   * Constructs the UrlBuilder.
   *
   * @param root - The key for the base URL (default is "BACKEND_ENDPOINT").
   * @param path - The key to lookup in API_ENDPOINT.
   *
   * @throws Error if the base URL or API endpoint is not found.
   */
  constructor({
    root = "BACKEND_ENDPOINT",
    path,
  }: {
    root?: RootEndpointKey;
    path: keyof typeof API_ENDPOINT;
  }) {
    let base = "";
    if (typeof process !== "undefined" && process.env) {
      base = process.env[root] || "";
    } else if (typeof window !== "undefined") {
      base = window.ENV?.[root] || window.ENV?.env?.[root] || "";
    }

    if (!base) {
      throw new Error(`Base URL is not defined for root: ${root}`);
    }
    this.baseUrl = base;

    const endpoint = API_ENDPOINT[path];
    if (!endpoint) {
      throw new Error(`API endpoint is not defined for path: ${path}`);
    }
    this.urlPath = endpoint;
    this.queryParams = new URLSearchParams();
  }

  /**
   * Replaces a URL parameter placeholder with a value.
   * Use placeholders in your endpoints like ":id".
   *
   * @param key - The key to replace.
   * @param value - The value to substitute.
   *
   * @returns The UrlBuilder instance for chaining.
   */
  param(key: string, value: string | number): this {
    const regex = new RegExp(`:${key}(?=/|$)`);
    this.urlPath = this.urlPath.replace(regex, encodeURIComponent(String(value)));
    return this;
  }

  /**
   * Appends query parameters to the URL.
   *
   * @param query - A record of query parameters.
   *
   * @returns The UrlBuilder instance for chaining.
   */
  query(query?: Record<string, string | string[] | null | undefined>): this {
    if (!query) return this;

    // Only include valid query parameters.
    if (validateQuery(query)) {
      for (const [key, value] of Object.entries(query)) {
        if (value == null) continue;
        if (Array.isArray(value)) {
          for (const v of value) {
            this.queryParams.append(key, v);
          }
        } else {
          this.queryParams.set(key, value);
        }
      }
    }
    return this;
  }

  /**
   * Builds the final URL, including the base, path, and query parameters.
   *
   * @returns The constructed URL as UrlBuilded.
   */
  build(): UrlBuilded {
    let url = this.baseUrl + this.urlPath;
    const queryString = this.queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    return url as UrlBuilded;
  }
}
