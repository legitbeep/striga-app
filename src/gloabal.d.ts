interface RouteConfig {
  path: string;
  element: React.ReactNode;
  protected?: boolean;
}

interface RouterProps {
  routes: RouteConfig[];
}

declare module "crypto-browserify";

interface ImportMeta {
  readonly env: Record<string, string>;
}
