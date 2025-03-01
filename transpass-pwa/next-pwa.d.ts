declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    cacheOnFrontEndNav?: boolean;
    reloadOnOnline?: boolean;
    subdomainPrefix?: string;
    buildExcludes?: Array<string | RegExp>;
    excludeManifestItems?: (url: string) => boolean;
    dynamicStartUrl?: boolean;
    fallbacks?: {
      [key: string]: string;
    };
    customWorkerDir?: string;
    runtimeCaching?: Array<{
      urlPattern: RegExp | string;
      handler: string;
      options?: {
        cacheName?: string;
        expiration?: {
          maxEntries?: number;
          maxAgeSeconds?: number;
        };
        cacheableResponse?: {
          statuses?: number[];
          headers?: {
            [key: string]: string;
          };
        };
      };
    }>;
    skipWaiting?: boolean;
    publicExcludes?: string[];
  }
  
  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
  export = withPWA;
}