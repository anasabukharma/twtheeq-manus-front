import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request, env, ctx) {
    try {
      // Try to serve the asset from KV
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: JSON.parse(__STATIC_CONTENT_MANIFEST),
        }
      );
    } catch (e) {
      // If asset not found, serve index.html for SPA routing
      try {
        const url = new URL(request.url);
        url.pathname = '/index.html';
        const newRequest = new Request(url.toString(), request);
        
        return await getAssetFromKV(
          {
            request: newRequest,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: JSON.parse(__STATIC_CONTENT_MANIFEST),
          }
        );
      } catch (e2) {
        return new Response('Not Found', { status: 404 });
      }
    }
  },
};
