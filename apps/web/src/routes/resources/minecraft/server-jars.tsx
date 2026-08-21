import { createFileRoute } from "@tanstack/react-router";

import { ResourceList } from "@/components/minecraft/resource-list";

export const Route = createFileRoute("/resources/minecraft/server-jars")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ResourceList />;
}
