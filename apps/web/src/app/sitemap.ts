import type { MetadataRoute } from 'next';

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://browserscan.org').replace(/\/$/, '');

const routes = [
  '/',
  '/tools',
  '/tools/ip-lookup',
  '/tools/leak-test',
  '/tools/port-scan',
  '/tools/pdf-gen',
  '/tools/cookie-check',
  '/simulation',
  '/simulation/recaptcha',
  '/simulation/turnstile',
  '/simulation/behavior',
  '/report',
  '/report/network',
  '/report/software',
  '/report/hardware',
  '/report/consistency',
  '/knowledge',
  '/knowledge/privacy',
  '/knowledge/methodology'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : 0.6
  }));
}
